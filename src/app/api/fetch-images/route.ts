import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import https from 'https';
import http from 'http';
import type { IncomingMessage } from 'http';
import { logger } from '@/lib/logger';

function fetchUrl(url: string, retryCount = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const maxRetries = 3; // Increased from 2 to 3
      const timeout = 30000; // Increased from 15s to 30s
      const retryDelay = retryCount * 2000; // Progressive delay: 0s, 2s, 4s

      logger.info(`Fetching URL: ${url} (Attempt ${retryCount + 1}/${maxRetries + 1})`);

      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        rejectUnauthorized: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Referer': parsedUrl.origin,
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout
      };

      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      const req = protocol.get(options, (res: IncomingMessage) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
          const redirectUrl = res.headers.location;
          if (redirectUrl) {
            logger.info(`Following redirect to: ${redirectUrl}`);
            // Handle relative redirects
            const absoluteRedirectUrl = redirectUrl.startsWith('http')
              ? redirectUrl
              : new URL(redirectUrl, `${parsedUrl.protocol}//${parsedUrl.host}`).toString();

            // Reset retry count for new URL
            return resolve(fetchUrl(absoluteRedirectUrl, 0));
          }
        }

        // Handle server errors
        if (res.statusCode && res.statusCode >= 500) {
          const error = new Error(`Server error! status: ${res.statusCode} for URL: ${url}`);
          if (retryCount < maxRetries) {
            logger.warn(`Server error (${res.statusCode}), retrying in ${retryDelay}ms...`);
            setTimeout(() => {
              resolve(fetchUrl(url, retryCount + 1));
            }, retryDelay);
            return;
          }
          logger.error(`Max retries reached for server error: ${url}`);
          return reject(error);
        }

        // Handle successful response
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          logger.info(`Successfully fetched URL: ${url}`);
          resolve(data);
        });

        // Handle response errors
        res.on('error', (error) => {
          logger.error(`Response error for ${url}: ${error.message}`);
          if (retryCount < maxRetries) {
            logger.warn(`Retrying in ${retryDelay}ms...`);
            setTimeout(() => {
              resolve(fetchUrl(url, retryCount + 1));
            }, retryDelay);
            return;
          }
          reject(error);
        });
      });

      // Handle request errors
      req.on('error', (error) => {
        logger.error(`Request error for ${url}: ${error.message}`);
        if (retryCount < maxRetries) {
          logger.warn(`Retrying in ${retryDelay}ms...`);
          setTimeout(() => {
            resolve(fetchUrl(url, retryCount + 1));
          }, retryDelay);
          return;
        }
        reject(error);
      });

      // Handle timeouts
      req.on('timeout', () => {
        logger.warn(`Request timeout for ${url}`);
        req.destroy();
        if (retryCount < maxRetries) {
          logger.warn(`Retrying in ${retryDelay}ms...`);
          setTimeout(() => {
            resolve(fetchUrl(url, retryCount + 1));
          }, retryDelay);
          return;
        }
        logger.error(`Max retries reached for timeout: ${url}`);
        reject(new Error(`Request timed out for: ${url}`));
      });

      req.end();
    } catch {
      logger.error(`Invalid URL: ${url}`);
      reject(new Error('Invalid URL'));
    }
  });
}

function normalizeUrl(url: string | null | undefined, baseUrl: string): string | null {
  try {
    if (!url || typeof url !== 'string' || url.startsWith('data:')) return null;

    // Clean up the URL
    url = url.trim();
    if (url.startsWith('//')) url = `https:${url}`;

    // Convert to absolute URL if needed
    if (!url.startsWith('http')) {
      try {
        const base = new URL(baseUrl);
        url = new URL(url, `${base.protocol}//${base.host}`).toString();
      } catch {
        return null;
      }
    }

    // Standardize image URLs
    let cleanUrl: URL;
    try {
      cleanUrl = new URL(url);
    } catch {
      return null;
    }

    // Only remove query params and hash
    cleanUrl.search = '';
    cleanUrl.hash = '';

    return cleanUrl.toString();
  } catch {
    return null;
  }
}

function extractSrcsetUrls(srcset: string): string[] {
  return srcset.split(',')
    .map(part => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParamRaw = searchParams.get('url');

    if (!urlParamRaw || !isString(urlParamRaw)) {
      return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const urlParam: string = urlParamRaw;
    const uniqueImages = new Set<string>();

    const html = await fetchUrl(urlParam);

    if (!html || html.length === 0) {
      return NextResponse.json({ error: 'No HTML content received' }, { status: 500 });
    }

    const $ = cheerio.load(html);

    // Process image elements
    const images = $('img');

    // Process image elements
    images.each((_, img) => {
      const element = img as unknown as Element;
      const src = element.attribs?.['src'];
      const dataSrc = element.attribs?.['data-src'];
      const dataSrcset = element.attribs?.['data-srcset'];
      const dataSrcLarge = element.attribs?.['data-large-src'];
      const dataSrcMedium = element.attribs?.['data-medium-src'];

      // Function to check if a URL is acceptable
      const isAcceptableImage = (url: string) => {
        const cleanUrl = url.toLowerCase().split('?')[0].split('#')[0];
        return !cleanUrl.endsWith('.svg') &&
               !cleanUrl.endsWith('.gif') &&
               !cleanUrl.endsWith('.ico');
      };

      // Add all possible image sources to our set if they pass the filter
      [src, dataSrc, dataSrcLarge, dataSrcMedium].forEach(imgSrc => {
        if (imgSrc && typeof imgSrc === 'string' && isAcceptableImage(imgSrc)) {
          const normalizedSrc = normalizeUrl(imgSrc, urlParam);
          if (normalizedSrc) {
            uniqueImages.add(normalizedSrc);
          }
        }
      });

      // Process srcset
      if (dataSrcset) {
        const srcsetUrls = extractSrcsetUrls(dataSrcset);
        srcsetUrls.forEach(url => {
          if (isAcceptableImage(url)) {
            const normalizedUrl = normalizeUrl(url, urlParam);
            if (normalizedUrl) {
              uniqueImages.add(normalizedUrl);
            }
          }
        });
      }
    });

    // Also look for images in background-image CSS
    $('[style*="background-image"]').each((_, element) => {
      const style = $(element).attr('style');
      if (style) {
        const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (match && match[1] && !match[1].toLowerCase().endsWith('.svg') && !match[1].toLowerCase().endsWith('.gif')) {
          const normalizedUrl = normalizeUrl(match[1], urlParam);
          if (normalizedUrl) {
            uniqueImages.add(normalizedUrl);
          }
        }
      }
    });

    const uniqueImageArray = Array.from(uniqueImages);

    return NextResponse.json({
      images: uniqueImageArray,
      debug: {
        totalImagesScanned: images.length,
        uniqueImagesFound: uniqueImageArray.length
      }
    });
  } catch {
    return NextResponse.json({
      error: 'Failed to fetch images',
      details: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
