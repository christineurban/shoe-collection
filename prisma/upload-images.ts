import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';

const prisma = new PrismaClient();

// Function to get all images from a URL
async function getImagesFromUrl(url: string): Promise<string[]> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = load(response.data);
    const images: string[] = [];

    // Get all img elements
    $('img').each((_: number, element) => {
      const src = $(element).attr('src');
      const dataSrc = $(element).attr('data-src'); // Some blogs lazy load images
      const srcset = $(element).attr('srcset');
      const alt = $(element).attr('alt')?.toLowerCase() || '';
      const classList = $(element).attr('class')?.toLowerCase() || '';
      const parentClass = $(element).parent().attr('class')?.toLowerCase() || '';
      const width = $(element).attr('width');
      const height = $(element).attr('height');

      // Skip if it's likely not a shoe image
      const isNotShoe =
        src?.includes('avatar') ||
        src?.includes('logo') ||
        src?.includes('icon') ||
        src?.includes('social') ||
        src?.includes('profile') ||
        src?.includes('banner') ||
        src?.includes('header') ||
        src?.includes('footer') ||
        src?.includes('thumb') ||
        src?.includes('small') ||
        src?.includes('tiny') ||
        alt.includes('avatar') ||
        alt.includes('logo') ||
        alt.includes('icon') ||
        alt.includes('social') ||
        alt.includes('profile') ||
        alt.includes('banner') ||
        alt.includes('header') ||
        alt.includes('footer') ||
        classList.includes('avatar') ||
        classList.includes('logo') ||
        classList.includes('icon') ||
        classList.includes('social') ||
        classList.includes('profile') ||
        classList.includes('banner') ||
        classList.includes('header') ||
        classList.includes('footer') ||
        classList.includes('thumb') ||
        classList.includes('small') ||
        classList.includes('tiny') ||
        parentClass.includes('thumb') ||
        parentClass.includes('small') ||
        parentClass.includes('tiny') ||
        (width && parseInt(width) < 200) ||
        (height && parseInt(height) < 200);

      if (src && !isNotShoe) {
        images.push(src);
      }
      if (dataSrc && !isNotShoe) {
        images.push(dataSrc);
      }
      if (srcset) {
        // Get the largest image from srcset
        const srcsetUrls = srcset.split(',')
          .map((s: string) => s.trim().split(' '))
          .filter((parts: string[]) => {
            const [url, size] = parts;
            if (!url || !size) return false;
            const sizeNum = parseInt(size);
            return !isNaN(sizeNum) && sizeNum >= 200;
          })
          .sort((a: string[], b: string[]) => parseInt(b[1]) - parseInt(a[1]))
          .map((parts: string[]) => parts[0])
          .filter((url: string) => {
            const isNotShoe = url.includes('avatar') ||
              url.includes('logo') ||
              url.includes('icon') ||
              url.includes('social') ||
              url.includes('profile') ||
              url.includes('banner') ||
              url.includes('header') ||
              url.includes('footer') ||
              url.includes('thumb') ||
              url.includes('small') ||
              url.includes('tiny');
            return !isNotShoe;
          });

        if (srcsetUrls.length > 0) {
          images.push(srcsetUrls[0]); // Only add the largest image
        }
      }
    });

    // Convert relative URLs to absolute and remove duplicates
    const uniqueImages = new Set(images.map(img => {
      if (img.startsWith('//')) {
        return `https:${img}`;
      }
      if (img.startsWith('/')) {
        const urlObj = new URL(url);
        return `${urlObj.protocol}//${urlObj.host}${img}`;
      }
      if (!img.startsWith('http')) {
        return new URL(img, url).toString();
      }
      return img;
    }));

    return Array.from(uniqueImages);
  } catch (error) {
    console.error(`Error fetching images from ${url}:`, error instanceof Error ? error.message : String(error));
    return [];
  }
}

async function generateHtmlReport(shoesWithImages: Array<{
  id: string;
  name: string;
  brand: { name: string };
  link: string | null;
  images: string[];
}>) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shoe Images Selection</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .shoe { border: 1px solid #ccc; margin: 20px 0; padding: 20px; border-radius: 8px; }
        .images { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .image-container { position: relative; }
        img { max-width: 100%; height: auto; border: 1px solid #eee; }
        .select-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #4CAF50;
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 4px;
        }
        .save-btn {
          background: #2196F3;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 4px;
          margin-top: 10px;
        }
        .no-images { color: red; }
        .metadata { margin-bottom: 10px; }
        .selected { border: 3px solid #4CAF50; }
      </style>
    </head>
    <body>
      <h1>Shoe Images Selection</h1>
      <p>Click on an image to select it, then click "Save" to update the database.</p>
      ${shoesWithImages.map(shoe => `
        <div class="shoe" id="shoe-${shoe.id}">
          <div class="metadata">
            <h2>${shoe.brand.name} - ${shoe.name}</h2>
            <p>ID: ${shoe.id}</p>
            <p>Link: <a href="${shoe.link}" target="_blank">${shoe.link}</a></p>
          </div>
          ${shoe.images.length ? `
            <div class="images">
              ${shoe.images.map(img => `
                <div class="image-container">
                  <img src="${img}" onerror="this.style.display='none'" onclick="selectImage('${shoe.id}', '${img}')" />
                </div>
              `).join('')}
            </div>
            <button class="save-btn" onclick="saveImage('${shoe.id}')">Save Selected Image</button>
          ` : `
            <p class="no-images">No images found on the linked page</p>
          `}
        </div>
      `).join('')}
      <script>
        const selectedImages = {};

        function selectImage(shoeId, imageUrl) {
          // Remove selected class from all images in this shoe
          document.querySelectorAll(\`#shoe-\${shoeId} img\`).forEach(img => {
            img.classList.remove('selected');
          });

          // Add selected class to clicked image
          event.target.classList.add('selected');

          // Store the selected image
          selectedImages[shoeId] = imageUrl;
        }

        async function saveImage(shoeId) {
          const imageUrl = selectedImages[shoeId];
          if (!imageUrl) {
            alert('Please select an image first');
            return;
          }

          try {
            const response = await fetch('http://localhost:3000/api/update-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: shoeId,
                imageUrl: imageUrl
              }),
            });

            if (response.ok) {
              alert('Image saved successfully!');
            } else {
              const errorData = await response.json();
              alert('Error saving image: ' + (errorData.error || 'Unknown error'));
            }
          } catch (error) {
            alert('Error saving image: ' + error.message);
          }
        }
      </script>
    </body>
    </html>
  `;

  const reportPath = path.join(process.cwd(), 'image-selection.html');
  fs.writeFileSync(reportPath, html);
  return reportPath;
}

async function main() {
  try {
    // Get all shoes with image URLs
    const shoes = await prisma.shoes.findMany({
      where: {
        image_url: {
          not: null
        }
      },
      select: {
        id: true,
        image_url: true,
        brand: {
          select: {
            name: true
          }
        }
      }
    });

    console.log(`Found ${shoes.length} shoes with images`);

    const shoesWithImages = [];

    for (const shoe of shoes) {
      if (!shoe.image_url) continue;

      console.log(`Processing ${shoe.brand.name} - ${shoe.id}...`);

      const images = await getImagesFromUrl(shoe.image_url);
      shoesWithImages.push({
        ...shoe,
        images
      });

      console.log(`Found ${images.length} images`);
    }

    // Generate HTML report
    const reportPath = await generateHtmlReport(shoesWithImages.map(shoe => ({
      id: shoe.id,
      name: shoe.id,
      brand: shoe.brand,
      link: shoe.image_url,
      images: shoe.images
    })));

    console.log(`\nReport generated at: ${reportPath}`);
    console.log('Please open this file in your browser to select the correct images.');
    console.log('\nAfter selecting images, you can update the database with:');
    console.log('npx prisma db execute --file update-image-urls.sql');

  } catch (error) {
    console.error('Error in main function:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
