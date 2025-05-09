'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import {
  StyledContainer,
  StyledBrandSection,
  StyledPolishList,
  StyledControls,
  StyledMixedStatus,
  StyledPolishGrid,
  StyledPolishName,
  StyledPolishToggle,
  StyledButtonGroup
} from '@/app/admin/bulk-update-old/page.styled';

interface Polish {
  id: string;
  name: string;
  is_old: boolean | null;
}

interface Brand {
  name: string;
  nail_polish: Polish[];
}

interface BrandPolishes {
  brand: string;
  polishes: Polish[];
}

export default function BulkUpdateOld() {
  const [brandPolishes, setBrandPolishes] = useState<BrandPolishes[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStates, setSelectedStates] = useState<Record<string, boolean>>({});
  const [mixedStatusBrands, setMixedStatusBrands] = useState<Set<string>>(new Set());
  const [individualPolishStates, setIndividualPolishStates] = useState<Record<string, boolean>>({});
  const [showingIndividualSelection, setShowingIndividualSelection] = useState(false);

  useEffect(() => {
    fetchPolishes();
  }, []);

  const fetchPolishes = async () => {
    try {
      const response = await fetch('/api/polishes/by-brand');
      if (!response.ok) throw new Error('Failed to fetch polishes');

      const data: Brand[] = await response.json();
      const processedData: BrandPolishes[] = data.map((brand) => ({
        brand: brand.name,
        polishes: brand.nail_polish
      }));

      setBrandPolishes(processedData);

      // Initialize selected states and polish states
      const states: Record<string, boolean> = {};
      const polishStates: Record<string, boolean> = {};

      processedData.forEach(brand => {
        // Default to false for brand states
        states[brand.brand] = false;

        // Initialize individual polish states with their current values
        brand.polishes.forEach(polish => {
          polishStates[polish.id] = polish.is_old ?? false;
        });
      });

      setSelectedStates(states);
      setIndividualPolishStates(polishStates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedStates(prev => ({
      ...prev,
      [brand]: !prev[brand]
    }));
  };

  const handleMixedStatusToggle = (brand: string) => {
    setMixedStatusBrands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(brand)) {
        newSet.delete(brand);
      } else {
        newSet.add(brand);
      }
      return newSet;
    });
  };

  const handlePolishToggle = (polishId: string) => {
    setIndividualPolishStates(prev => ({
      ...prev,
      [polishId]: !prev[polishId]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare updates for brands not marked as mixed status
      const brandUpdates = Object.entries(selectedStates)
        .filter(([brand]) => !mixedStatusBrands.has(brand))
        .map(([brand, isOld]) => ({
          brand,
          is_old: isOld,
          polish_ids: null // null means update all polishes for this brand
        }));

      // Prepare updates for individually selected polishes in mixed status brands
      const individualUpdates = brandPolishes
        .filter(({ brand }) => mixedStatusBrands.has(brand))
        .map(({ brand, polishes }) => ({
          brand,
          is_old: null, // null means look at polish_ids
          polish_ids: polishes.map(p => ({
            id: p.id,
            is_old: individualPolishStates[p.id] ?? false // Ensure we send a boolean value
          }))
        }));

      // Add updates for any brands not explicitly handled (mark them as not old)
      const handledBrands = new Set([
        ...brandUpdates.map(u => u.brand),
        ...individualUpdates.map(u => u.brand)
      ]);

      const remainingBrandUpdates = brandPolishes
        .filter(({ brand }) => !handledBrands.has(brand))
        .map(({ brand }) => ({
          brand,
          is_old: false,
          polish_ids: null
        }));

      const updates = [...brandUpdates, ...individualUpdates, ...remainingBrandUpdates];

      const response = await fetch('/api/polishes/bulk-update-old', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) throw new Error('Failed to update polishes');

      // Refresh the data
      await fetchPolishes();
      setShowingIndividualSelection(false);
      setMixedStatusBrands(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageHeader title="Loading..." />;
  }

  if (error) {
    return <PageHeader title="Error" description={error} />;
  }

  if (!showingIndividualSelection) {
    return (
      <>
        <PageHeader
          title="Step 1: Mark Mixed Status Brands"
          description="Select which brands need individual polish review"
        />
        <StyledContainer>
          {brandPolishes.map(({ brand, polishes }) => (
            <StyledBrandSection key={brand}>
              <StyledControls>
                <h2>{brand}</h2>
                <StyledButtonGroup>
                  <Button
                    $variant={mixedStatusBrands.has(brand) ? "tertiary" : "secondary"}
                    onClick={() => handleMixedStatusToggle(brand)}
                  >
                    {mixedStatusBrands.has(brand) ? 'Remove Mixed Status' : 'Mark as Mixed Status'}
                  </Button>
                  {!mixedStatusBrands.has(brand) && (
                    <Button
                      $variant={selectedStates[brand] ? "tertiary" : "secondary"}
                      onClick={() => handleBrandToggle(brand)}
                    >
                      {selectedStates[brand] ? 'Mark as Not Old' : 'Mark as Old'}
                    </Button>
                  )}
                </StyledButtonGroup>
              </StyledControls>

              <StyledPolishList>
                <p>{polishes.length} polishes</p>
              </StyledPolishList>
            </StyledBrandSection>
          ))}

          {mixedStatusBrands.size > 0 && (
            <Button
              $variant="tertiary"
              onClick={() => setShowingIndividualSelection(true)}
            >
              Continue to Individual Selection
            </Button>
          )}
        </StyledContainer>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Step 2: Select Individual Polishes"
        description="Click on each polish to toggle between OLD and NEW status. Changes will be saved when you click 'Save All Changes'."
      />
      <StyledContainer>
        {brandPolishes
          .filter(({ brand }) => mixedStatusBrands.has(brand))
          .map(({ brand, polishes }) => (
            <StyledBrandSection key={brand}>
              <StyledControls>
                <h2>{brand}</h2>
                <p>Click polishes to toggle their status</p>
              </StyledControls>

              <StyledPolishGrid>
                {polishes.map(polish => (
                  <StyledPolishToggle
                    key={polish.id}
                    onClick={() => handlePolishToggle(polish.id)}
                    $isOld={individualPolishStates[polish.id]}
                    aria-pressed={individualPolishStates[polish.id]}
                    aria-label={`Toggle ${polish.name} as ${individualPolishStates[polish.id] ? 'new' : 'old'}`}
                  >
                    {polish.name}
                  </StyledPolishToggle>
                ))}
              </StyledPolishGrid>
            </StyledBrandSection>
          ))}

        <StyledButtonGroup>
          <Button
            $variant="secondary"
            onClick={() => setShowingIndividualSelection(false)}
          >
            Back to Brand Selection
          </Button>
          <Button
            $variant="tertiary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </StyledButtonGroup>
      </StyledContainer>
    </>
  );
}
