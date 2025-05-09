'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import {
  StyledStatsGrid,
  StyledAttributeList,
  StyledSortControls,
  StyledSortButton,
  StyledAddForm,
  StyledMessage,
  StyledViewControls,
  StyledViewButton,
  StyledInputContainer,
  StyledSectionHeading,
  StyledInputControls,
  StyledNote,
  StyledAddButtonContainer,
  StyledScrollIndicator
} from './page.styled';
import { BsGrid, BsTable, BsTrash, BsChevronDown } from 'react-icons/bs';
import { Table } from '@/components/Table';
import { Tabs } from '@/components/Tabs';
import { Input } from '@/components/fields/Input';
import { Button } from '@/components/Button';
import { Tile } from '@/components/Tile';
import { Modal } from '@/components/Modal';
import { SuccessMessage } from '@/components/SuccessMessage';
import { StyledNameCell, StyledPercentageHeader } from '@/components/Table/index.styled';
import { Tooltip } from 'react-tooltip';

interface Stats {
  totalPolishes: number;
  totalBrands: number;
  totalColors: number;
  totalFinishes: number;
  mostPopularNewBrand: {
    name: string;
    count: number;
  };
  mostCommonBrand: {
    name: string;
    count: number;
  };
  mostCommonColor: {
    name: string;
    count: number;
  };
  mostCommonFinish: {
    name: string;
    count: number;
  };
}

interface Attribute {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

type SortOrder = 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc';
type ViewMode = 'card' | 'table';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colors, setColors] = useState<Attribute[]>([]);
  const [finishes, setFinishes] = useState<Attribute[]>([]);
  const [brands, setBrands] = useState<Attribute[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<'brands' | 'colors' | 'finishes' | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('name-asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const attributeListRef = useRef<HTMLDivElement>(null);

  const singularForms: Record<'brands' | 'colors' | 'finishes', 'brand' | 'color' | 'finish'> = {
    colors: 'color',
    finishes: 'finish',
    brands: 'brand'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, attributesResponse] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/attributes')
        ]);

        const statsData = await statsResponse.json();
        const attributesData = await attributesResponse.json();

        setStats(statsData);
        setColors(attributesData.colors);
        setFinishes(attributesData.finishes);
        setBrands(attributesData.brands);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string, type: 'color' | 'finish' | 'brand') => {
    try {
      const response = await fetch('/api/attributes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete attribute');
      }

      const fetchAttributes = async () => {
        const response = await fetch('/api/attributes');
        const data = await response.json();
        setColors(data.colors);
        setFinishes(data.finishes);
        setBrands(data.brands);
      };

      fetchAttributes();
    } catch (error: any) {
      console.error('Error deleting attribute:', error);
      setError(error.message);
    }
  };

  const handleAdd = async (e: React.FormEvent, type: 'color' | 'finish' | 'brand') => {
    e.preventDefault();

    if (!newAttributeName.trim()) {
      setError('Name cannot be empty');
      setSuccess(null);
      return;
    }

    try {
      const response = await fetch('/api/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name: newAttributeName.trim()
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add attribute');
      }

      const singularType = singularForms[`${type}s` as keyof typeof singularForms];
      setNewAttributeName('');
      setError(null);
      setSuccess(`Successfully added ${singularType}: ${newAttributeName}`);

      const fetchAttributes = async () => {
        const response = await fetch('/api/attributes');
        const data = await response.json();
        setColors(data.colors);
        setFinishes(data.finishes);
        setBrands(data.brands);
      };

      fetchAttributes();
    } catch (error: any) {
      console.error('Error adding attribute:', error);
      setError(error.message);
      setSuccess(null);
    }
  };

  const sortAttributes = (attributes: Attribute[]): Attribute[] => {
    return [...attributes].sort((a, b) => {
      switch (sortOrder) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'count-asc':
          return b.count - a.count;
        case 'count-desc':
          return a.count - b.count;
        default:
          return 0;
      }
    });
  };

  const filterAttributes = (attributes: Attribute[]): Attribute[] => {
    if (!searchTerm) return attributes;
    const term = searchTerm.toLowerCase();
    return attributes.filter(attr =>
      attr.name.toLowerCase().includes(term)
    );
  };

  const renderTable = (attributes: Attribute[], attributeType: 'color' | 'finish' | 'brand') => {
    const columns = [
      {
        header: 'Name',
        key: 'name' as const,
        sortable: true,
        render: (item: Attribute) => (
          <StyledNameCell>
            {item.name}
            {Number(item.count) <= 0 && (
              <>
                <BsTrash
                  onClick={() => handleDelete(item.id, attributeType)}
                  role="button"
                  aria-label={`Delete ${item.name}`}
                  className="delete-icon"
                  data-tooltip-id={`delete-tooltip-${item.id}`}
                  data-tooltip-content={`Delete ${item.name}`}
                />
                <Tooltip id={`delete-tooltip-${item.id}`} />
              </>
            )}
          </StyledNameCell>
        )
      },
      {
        header: 'Count',
        key: 'count' as const,
        sortable: true,
        render: (item: Attribute) => item.count.toString()
      },
      {
        header: <StyledPercentageHeader><span className="desktop-only">Percentage</span><span className="mobile-only">%</span></StyledPercentageHeader>,
        key: 'percentage' as const,
        sortable: true,
        render: (item: Attribute) => `${item.percentage.toFixed(1)}%`
      }
    ];

    const handleSort = (field: string) => {
      const newOrder = field === 'name'
        ? sortOrder === 'name-asc' ? 'name-desc' : 'name-asc'
        : field === 'count'
        ? sortOrder === 'count-asc' ? 'count-desc' : 'count-asc'
        : sortOrder;
      setSortOrder(newOrder as SortOrder);
    };

    const getSortDirection = (field: string) => {
      if (field === 'name' && (sortOrder === 'name-asc' || sortOrder === 'name-desc')) {
        return sortOrder === 'name-asc' ? 'asc' : 'desc';
      }
      if (field === 'count' && (sortOrder === 'count-asc' || sortOrder === 'count-desc')) {
        return sortOrder === 'count-asc' ? 'asc' : 'desc';
      }
      return undefined;
    };

    const getSortField = () => {
      if (sortOrder.startsWith('name-')) return 'name';
      if (sortOrder.startsWith('count-')) return 'count';
      return undefined;
    };

    return (
      <Table
        data={attributes}
        columns={columns}
        sortField={getSortField()}
        sortDirection={getSortDirection(getSortField() || '')}
        onSort={handleSort}
      />
    );
  };

  const renderCards = (attributes: Attribute[], attributeType: 'color' | 'finish' | 'brand') => {
    return (
      <StyledAttributeList>
        {attributes.map(attr => (
          <div key={attr.id}>
            <Tile
              title={attr.name}
              value={`${attr.count} ${attr.count === 1 ? 'polish' : 'polishes'}`}
              percentage={`${attr.percentage.toFixed(1)}%`}
              variant="attribute"
              showDelete={attr.count === 0}
              onDelete={() => handleDelete(attr.id, attributeType)}
            />
          </div>
        ))}
      </StyledAttributeList>
    );
  };

  const handleStatClick = (type: 'brands' | 'colors' | 'finishes') => {
    setSelectedAttribute(type);

    // Only scroll on mobile
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        if (attributeListRef.current) {
          const navHeight = 64; // Height of the nav bar
          const elementPosition = attributeListRef.current.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const getAttributeList = (type: 'colors' | 'finishes' | 'brands'): Attribute[] => {
    return type === 'colors' ? colors : type === 'finishes' ? finishes : brands;
  };

  if (isLoading) {
    return <PageHeader title="Loading..." />;
  }

  if (error) {
    return <PageHeader title="Error" description={error} />;
  }

  if (!stats) {
    return <PageHeader title="No data available" />;
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Click on a tile to view and manage details"
      />
      <StyledStatsGrid>
        <Tile
          title="Total Polishes"
          value={stats.totalPolishes}
          description="Polishes in your collection"
          onClick={() => router.push('/')}
        />

        <Tile
          title="Brands"
          value={stats.totalBrands}
          description="Different brands collected"
          onClick={() => handleStatClick('brands')}
          $isActive={selectedAttribute === 'brands'}
        />

        <Tile
          title="Colors"
          value={stats.totalColors}
          description="Unique colors in your collection"
          onClick={() => handleStatClick('colors')}
          $isActive={selectedAttribute === 'colors'}
        />

        <Tile
          title="Finishes"
          value={stats.totalFinishes}
          description="Different finishes available"
          onClick={() => handleStatClick('finishes')}
          $isActive={selectedAttribute === 'finishes'}
        />

        <Tile
          title="Top New Brand"
          value={stats.mostPopularNewBrand.name}
          description={`${stats.mostPopularNewBrand.count} polishes`}
          onClick={() => {
            const params = new URLSearchParams();
            params.append('brand', stats.mostPopularNewBrand.name);
            router.push(`/?${params.toString()}`);
          }}
        />

        <Tile
          title="Most Popular Brand"
          value={stats.mostCommonBrand.name}
          description={`${stats.mostCommonBrand.count} polishes`}
          onClick={() => {
            const params = new URLSearchParams();
            params.append('brand', stats.mostCommonBrand.name);
            router.push(`/?${params.toString()}`);
          }}
        />

        <Tile
          title="Most Common Color"
          value={stats.mostCommonColor.name}
          description={`${stats.mostCommonColor.count} polishes`}
          onClick={() => {
            const params = new URLSearchParams();
            params.append('color', stats.mostCommonColor.name);
            router.push(`/?${params.toString()}`);
          }}
        />

        <Tile
          title="Most Common Finish"
          value={stats.mostCommonFinish.name}
          description={`${stats.mostCommonFinish.count} polishes`}
          onClick={() => {
            const params = new URLSearchParams();
            params.append('finish', stats.mostCommonFinish.name);
            router.push(`/?${params.toString()}`);
          }}
        />
      </StyledStatsGrid>

      {error && (
        <StyledMessage $type="error">{error}</StyledMessage>
      )}

      {selectedAttribute && (
        <>
          <StyledScrollIndicator>
            <BsChevronDown />
          </StyledScrollIndicator>

          <div ref={attributeListRef}>
            <StyledSectionHeading>
              <h2>{selectedAttribute.charAt(0).toUpperCase() + selectedAttribute.slice(1)}</h2>
              <StyledAddButtonContainer>
                <a
                  onClick={() => setIsAddModalOpen(true)}
                  role="button"
                  tabIndex={0}
                >
                  + Add {singularForms[selectedAttribute]}
                </a>
              </StyledAddButtonContainer>
            </StyledSectionHeading>

            <StyledViewControls>
              <StyledViewButton
                onClick={() => setViewMode('card')}
                $isActive={viewMode === 'card'}
              >
                <BsGrid /> Cards
              </StyledViewButton>
              <StyledViewButton
                onClick={() => setViewMode('table')}
                $isActive={viewMode === 'table'}
              >
                <BsTable /> Table
              </StyledViewButton>
            </StyledViewControls>

            <StyledSortControls>
              <StyledSortButton
                onClick={() => {
                  const newOrder = sortOrder.startsWith('name-')
                    ? sortOrder === 'name-asc' ? 'name-desc' : 'name-asc'
                    : 'name-asc';
                  setSortOrder(newOrder);
                }}
                $isActive={sortOrder.startsWith('name-')}
                $direction={sortOrder === 'name-asc' ? 'asc' : sortOrder === 'name-desc' ? 'desc' : undefined}
              >
                Name
              </StyledSortButton>
              <StyledSortButton
                onClick={() => {
                  const newOrder = sortOrder.startsWith('count-')
                    ? sortOrder === 'count-asc' ? 'count-desc' : 'count-asc'
                    : 'count-asc';
                  setSortOrder(newOrder);
                }}
                $isActive={sortOrder.startsWith('count-')}
                $direction={sortOrder === 'count-asc' ? 'asc' : sortOrder === 'count-desc' ? 'desc' : undefined}
              >
                Count
              </StyledSortButton>
            </StyledSortControls>

            <StyledInputControls>
              <StyledInputContainer>
                <Input
                  placeholder={`Search ${selectedAttribute}...`}
                  value={searchTerm}
                  onChange={setSearchTerm}
                  aria-label={`Search ${selectedAttribute}`}
                />
              </StyledInputContainer>

              <StyledAddForm onSubmit={(e) => handleAdd(e, singularForms[selectedAttribute])}>
                <StyledInputContainer>
                  <Input
                    placeholder={`Add new ${singularForms[selectedAttribute]}...`}
                    value={newAttributeName}
                    onChange={setNewAttributeName}
                    aria-label={`Add new ${singularForms[selectedAttribute]}`}
                  />
                </StyledInputContainer>
                <Button type="submit">
                  Add {singularForms[selectedAttribute]}
                </Button>
              </StyledAddForm>
            </StyledInputControls>

            {viewMode === 'card' ? (
              renderCards(filterAttributes(sortAttributes(getAttributeList(selectedAttribute))), singularForms[selectedAttribute])
            ) : (
              renderTable(filterAttributes(sortAttributes(getAttributeList(selectedAttribute))), singularForms[selectedAttribute])
            )}

            <StyledNote>
              Note: A {singularForms[selectedAttribute]} can only be deleted if there are no polishes associated with it
            </StyledNote>

            <Modal
              isOpen={isAddModalOpen}
              onClose={() => {
                setIsAddModalOpen(false);
                setNewAttributeName('');
              }}
              title={`Add new ${singularForms[selectedAttribute]}`}
              footer={
                <>
                  <Button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setNewAttributeName('');
                    }}
                    $variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => {
                      handleAdd(e as any, singularForms[selectedAttribute]);
                      setIsAddModalOpen(false);
                    }}
                  >
                    Add {singularForms[selectedAttribute]}
                  </Button>
                </>
              }
            >
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAdd(e, singularForms[selectedAttribute]);
                setIsAddModalOpen(false);
              }}>
                <Input
                  type="text"
                  value={newAttributeName}
                  onChange={setNewAttributeName}
                  placeholder={`Enter ${singularForms[selectedAttribute]} name...`}
                  autoFocus
                />
              </form>
            </Modal>
          </div>
        </>
      )}

      <SuccessMessage
        message={success}
        onClose={() => setSuccess(null)}
      />
    </>
  );
}
