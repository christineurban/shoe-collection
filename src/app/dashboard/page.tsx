'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import {
  StyledStatsGrid,
  StyledAttributeList,
  StyledSortControls,
  StyledSortButton,
  StyledAddForm,
  StyledViewControls,
  StyledViewButton,
  StyledInputContainer,
  StyledSectionHeading,
  StyledInputControls,
  StyledNote,
  StyledAddButtonContainer,
  StyledScrollIndicator,
  StyledDashboard
} from './page.styled';
import { BsGrid, BsTable, BsChevronDown } from 'react-icons/bs';
import { Input } from '@/components/fields/Input';
import { Button } from '@/components/Button';
import { Tile } from '@/components/Tile';
import { Modal } from '@/components/Modal';
import { SuccessMessage } from '@/components/SuccessMessage';
import { Stats } from '@/types/stats';
import { Attribute } from '@/types/attribute';
import { AttributeTable } from '@/components/AttributeTable';
import { useAuth } from '@/lib/auth/AuthContext';

type SortOrder = 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc';
type ViewMode = 'card' | 'table';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalShoes: 0,
    totalBrands: 0,
    totalColors: 0,
    totalDressStyles: 0,
    totalShoeTypes: 0,
    totalHeelTypes: 0,
    totalLocations: 0,
    mostCommonBrand: { name: '', count: 0 },
    mostCommonColor: { name: '', count: 0 },
    mostCommonDressStyle: { name: '', count: 0 },
    mostCommonShoeType: { name: '', count: 0 },
    mostCommonHeelType: { name: '', count: 0 },
    mostCommonLocation: { name: '', count: 0 }
  });

  const [brands, setBrands] = useState<Attribute[]>([]);
  const [colors, setColors] = useState<Attribute[]>([]);
  const [dressStyles, setDressStyles] = useState<Attribute[]>([]);
  const [shoeTypes, setShoeTypes] = useState<Attribute[]>([]);
  const [heelTypes, setHeelTypes] = useState<Attribute[]>([]);
  const [locations, setLocations] = useState<Attribute[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<'brands' | 'colors' | 'dressStyles' | 'shoeTypes' | 'heelTypes' | 'locations' | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('name-asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const attributeListRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const singularForms: Record<'brands' | 'colors' | 'dressStyles' | 'shoeTypes' | 'heelTypes' | 'locations', 'brand' | 'color' | 'dressStyle' | 'shoeType' | 'heelType' | 'location'> = {
    colors: 'color',
    dressStyles: 'dressStyle',
    shoeTypes: 'shoeType',
    heelTypes: 'heelType',
    locations: 'location',
    brands: 'brand'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, attributesResponse] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/attributes')
        ]);

        if (!statsResponse.ok || !attributesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const statsData = await statsResponse.json();
        const attributesData = await attributesResponse.json();

        setStats(statsData);
        setBrands(attributesData.brands);
        setColors(attributesData.colors);
        setDressStyles(attributesData.dressStyles);
        setShoeTypes(attributesData.shoeTypes);
        setHeelTypes(attributesData.heelTypes);
        setLocations(attributesData.locations);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchStats = async () => {
    const response = await fetch('/api/stats');
    if (response.ok) {
      const statsData = await response.json();
      setStats(statsData);
    }
  };

  const handleDelete = async (id: string, type: 'brand' | 'color' | 'dressStyle' | 'shoeType' | 'heelType' | 'location') => {
    try {
      const response = await fetch(`/api/attributes?type=${type}&id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete attribute');
      }

      const data = await response.json();
      switch (type) {
        case 'brand':
          setBrands(data.brands);
          break;
        case 'color':
          setColors(data.colors);
          break;
        case 'dressStyle':
          setDressStyles(data.dressStyles);
          break;
        case 'shoeType':
          setShoeTypes(data.shoeTypes);
          break;
        case 'heelType':
          setHeelTypes(data.heelTypes);
          break;
        case 'location':
          setLocations(data.locations);
          break;
      }
      await fetchStats();
      setSuccess(`Successfully deleted ${formatAttributeType(type)}`);
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };

  const handleAdd = async (name: string, type: 'brand' | 'color' | 'dressStyle' | 'shoeType' | 'heelType' | 'location') => {
    if (!name) return;

    try {
      const response = await fetch('/api/attributes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, name })
      });

      if (!response.ok) {
        throw new Error('Failed to add attribute');
      }

      const data = await response.json();
      switch (type) {
        case 'brand':
          setBrands(data.brands);
          break;
        case 'color':
          setColors(data.colors);
          break;
        case 'dressStyle':
          setDressStyles(data.dressStyles);
          break;
        case 'shoeType':
          setShoeTypes(data.shoeTypes);
          break;
        case 'heelType':
          setHeelTypes(data.heelTypes);
          break;
        case 'location':
          setLocations(data.locations);
          break;
      }
      setNewAttributeName('');
      await fetchStats();
      setSuccess(`Successfully added ${formatAttributeType(type)}: ${name}`);
    } catch (error) {
      console.error('Error adding attribute:', error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent, type: 'brand' | 'color' | 'dressStyle' | 'shoeType' | 'heelType' | 'location') => {
    e.preventDefault();
    handleAdd(newAttributeName, type);
  };

  const sortAttributes = (attributes: Attribute[] = []): Attribute[] => {
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

  const renderTable = (attributes: Attribute[], attributeType: 'brand' | 'color' | 'dressStyle' | 'shoeType' | 'heelType' | 'location') => {
    return (
      <AttributeTable
        attributes={attributes}
        onDelete={(id) => handleDelete(id, attributeType)}
      />
    );
  };

  const renderCards = (attributes: Attribute[], attributeType: 'brand' | 'color' | 'dressStyle' | 'shoeType' | 'heelType' | 'location') => {
    return (
      <StyledAttributeList>
        {attributes.map(attr => (
          <div key={attr.id}>
            <Tile
              title={attr.name}
              value={`${attr.count} ${attr.count === 1 ? 'shoe' : 'shoes'}`}
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

  const handleStatClick = (type: 'brands' | 'colors' | 'dressStyles' | 'shoeTypes' | 'heelTypes' | 'locations') => {
    if (!isAuthenticated) {
      return; // Do nothing if not authenticated
    }
    setSelectedAttribute(type);
    if (attributeListRef.current) {
      attributeListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getAttributeList = (type: 'brands' | 'colors' | 'dressStyles' | 'shoeTypes' | 'heelTypes' | 'locations'): Attribute[] => {
    switch (type) {
      case 'brands':
        return brands;
      case 'colors':
        return colors;
      case 'dressStyles':
        return dressStyles;
      case 'shoeTypes':
        return shoeTypes;
      case 'heelTypes':
        return heelTypes;
      case 'locations':
        return locations;
      default:
        return [];
    }
  };

  const formatAttributeType = (type: string): string => {
    return type
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .toLowerCase(); // Convert to lowercase
  };

  if (isLoading) {
    return (
      <StyledDashboard>
        <PageHeader title="Loading..." />
      </StyledDashboard>
    );
  }

  if (error) {
    return (
      <StyledDashboard>
        <PageHeader
          title="Error"
          description={error}
        />
      </StyledDashboard>
    );
  }

  return (
    <StyledDashboard>
      <PageHeader
        title="Dashboard"
        description={isAuthenticated ? "Click on a tile to view and manage details" : "View collection statistics"}
      />

      <SuccessMessage
        message={success}
        onClose={() => setSuccess(null)}
      />

      <StyledStatsGrid>
        <Tile
          title="Total Shoes"
          value={stats.totalShoes}
          description="Shoes in collection"
          onClick={() => router.push('/')}
          variant="stat"
        />
        <Tile
          title="Brands"
          value={stats.totalBrands}
          description="Brands available"
          onClick={() => handleStatClick('brands')}
          $isActive={selectedAttribute === 'brands'}
          variant="stat"
        />
        <Tile
          title="Colors"
          value={stats.totalColors}
          description="Colors available"
          onClick={() => handleStatClick('colors')}
          $isActive={selectedAttribute === 'colors'}
          variant="stat"
        />
        <Tile
          title="Dress Styles"
          value={stats.totalDressStyles}
          description="Dress styles available"
          onClick={() => handleStatClick('dressStyles')}
          $isActive={selectedAttribute === 'dressStyles'}
          variant="stat"
        />
        <Tile
          title="Shoe Types"
          value={stats.totalShoeTypes}
          description="Shoe types available"
          onClick={() => handleStatClick('shoeTypes')}
          $isActive={selectedAttribute === 'shoeTypes'}
          variant="stat"
        />
        <Tile
          title="Heel Types"
          value={stats.totalHeelTypes}
          description="Heel types available"
          onClick={() => handleStatClick('heelTypes')}
          $isActive={selectedAttribute === 'heelTypes'}
          variant="stat"
        />
        <Tile
          title="Locations"
          value={stats.totalLocations}
          description="Locations available"
          onClick={() => handleStatClick('locations')}
          $isActive={selectedAttribute === 'locations'}
          variant="stat"
        />
      </StyledStatsGrid>

      {selectedAttribute && isAuthenticated && (
        <>
          <StyledScrollIndicator>
            <BsChevronDown />
          </StyledScrollIndicator>

          <div ref={attributeListRef}>
            <StyledSectionHeading>
              <h2>{selectedAttribute.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
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
                  placeholder={`Search ${formatAttributeType(selectedAttribute)}...`}
                  value={searchTerm}
                  onChange={setSearchTerm}
                  aria-label={`Search ${formatAttributeType(selectedAttribute)}`}
                />
              </StyledInputContainer>

              <StyledAddForm onSubmit={(e) => handleFormSubmit(e, singularForms[selectedAttribute])}>
                <StyledInputContainer>
                  <Input
                    name="name"
                    placeholder={`Add new ${formatAttributeType(singularForms[selectedAttribute])}...`}
                    value={newAttributeName}
                    onChange={setNewAttributeName}
                    aria-label={`Add new ${formatAttributeType(singularForms[selectedAttribute])}`}
                  />
                </StyledInputContainer>
                <Button type="submit">
                  Add {formatAttributeType(singularForms[selectedAttribute])}
                </Button>
              </StyledAddForm>
            </StyledInputControls>

            {viewMode === 'card' ? (
              renderCards(filterAttributes(sortAttributes(getAttributeList(selectedAttribute))), singularForms[selectedAttribute])
            ) : (
              renderTable(filterAttributes(sortAttributes(getAttributeList(selectedAttribute))), singularForms[selectedAttribute])
            )}

            <StyledNote>
              Note: A {formatAttributeType(singularForms[selectedAttribute])} can only be deleted if there are no shoes associated with it
            </StyledNote>

            <Modal
              isOpen={isAddModalOpen}
              onClose={() => {
                setIsAddModalOpen(false);
                setNewAttributeName('');
              }}
              title={`Add new ${formatAttributeType(singularForms[selectedAttribute])}`}
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
                      handleFormSubmit(e as any, singularForms[selectedAttribute]);
                      setIsAddModalOpen(false);
                    }}
                  >
                    Add {formatAttributeType(singularForms[selectedAttribute])}
                  </Button>
                </>
              }
            >
              <form onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit(e, singularForms[selectedAttribute]);
                setIsAddModalOpen(false);
              }}>
                <Input
                  type="text"
                  value={newAttributeName}
                  onChange={setNewAttributeName}
                  placeholder={`Enter ${formatAttributeType(singularForms[selectedAttribute])} name...`}
                  autoFocus
                />
              </form>
            </Modal>
          </div>
        </>
      )}
    </StyledDashboard>
  );
}
