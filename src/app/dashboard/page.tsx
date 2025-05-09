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
import { Stats } from '@/types/stats';
import { Attribute } from '@/types/attribute';
import { StatCard } from '@/components/StatCard';
import { AttributeTable } from '@/components/AttributeTable';
import { AttributeCard } from '@/components/AttributeCard';
import { AddAttributeForm } from '@/components/AddAttributeForm';
import { StyledDashboard, StyledAttributeSection } from './page.styled';

type SortOrder = 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc';
type ViewMode = 'card' | 'table';

export default function Dashboard() {
  const router = useRouter();
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
      }
    };

    fetchData();
  }, []);

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
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };

  const handleAdd = async (e: React.FormEvent, type: 'brand' | 'color' | 'dressStyle' | 'shoeType' | 'heelType' | 'location') => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

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

      form.reset();
    } catch (error) {
      console.error('Error adding attribute:', error);
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {attributes.map((attribute) => (
          <AttributeCard
            key={attribute.id}
            attribute={attribute}
            onDelete={() => handleDelete(attribute.id, attributeType)}
          />
        ))}
      </div>
    );
  };

  const handleStatClick = (type: 'brands' | 'colors' | 'dressStyles' | 'shoeTypes' | 'heelTypes' | 'locations') => {
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
    }
  };

  if (!stats) {
    return <PageHeader title="No data available" />;
  }

  return (
    <StyledDashboard>
      <h1>Dashboard</h1>

      <StyledStatsGrid>
        <StatCard
          title="Total Shoes"
          value={stats.totalShoes}
          description="Total number of shoes in collection"
        />

        <StatCard
          title="Brands"
          value={stats.totalBrands}
          description="Different brands available"
          onClick={() => handleStatClick('brands')}
          $isActive={selectedAttribute === 'brands'}
        />

        <StatCard
          title="Colors"
          value={stats.totalColors}
          description="Different colors available"
          onClick={() => handleStatClick('colors')}
          $isActive={selectedAttribute === 'colors'}
        />

        <StatCard
          title="Dress Styles"
          value={stats.totalDressStyles}
          description="Different dress styles available"
          onClick={() => handleStatClick('dressStyles')}
          $isActive={selectedAttribute === 'dressStyles'}
        />

        <StatCard
          title="Shoe Types"
          value={stats.totalShoeTypes}
          description="Different shoe types available"
          onClick={() => handleStatClick('shoeTypes')}
          $isActive={selectedAttribute === 'shoeTypes'}
        />

        <StatCard
          title="Heel Types"
          value={stats.totalHeelTypes}
          description="Different heel types available"
          onClick={() => handleStatClick('heelTypes')}
          $isActive={selectedAttribute === 'heelTypes'}
        />

        <StatCard
          title="Locations"
          value={stats.totalLocations}
          description="Different locations available"
          onClick={() => handleStatClick('locations')}
          $isActive={selectedAttribute === 'locations'}
        />

        <StatCard
          title="Most Common Brand"
          value={stats.mostCommonBrand.name}
          description={`${stats.mostCommonBrand.count} shoes`}
          onClick={() => {
            const params = new URLSearchParams();
            params.append('brand', stats.mostCommonBrand.name);
            router.push(`/?${params.toString()}`);
          }}
        />

        <StatCard
          title="Most Common Color"
          value={stats.mostCommonColor.name}
          description={`${stats.mostCommonColor.count} shoes`}
          onClick={() => {
            const params = new URLSearchParams();
            params.append('color', stats.mostCommonColor.name);
            router.push(`/?${params.toString()}`);
          }}
        />

        <StatCard
          title="Most Common Dress Style"
          value={stats.mostCommonDressStyle.name}
          description={`${stats.mostCommonDressStyle.count} shoes`}
          onClick={() => {
            const params = new URLSearchParams();
            params.append('dressStyle', stats.mostCommonDressStyle.name);
            router.push(`/?${params.toString()}`);
          }}
        />

        <StatCard
          title="Most Common Shoe Type"
          value={stats.mostCommonShoeType.name}
          description={`${stats.mostCommonShoeType.count} shoes`}
          onClick={() => {
            const params = new URLSearchParams();
            params.append('shoeType', stats.mostCommonShoeType.name);
            router.push(`/?${params.toString()}`);
          }}
        />

        <StatCard
          title="Most Common Heel Type"
          value={stats.mostCommonHeelType.name}
          description={`${stats.mostCommonHeelType.count} shoes`}
          onClick={() => {
            const params = new URLSearchParams();
            params.append('heelType', stats.mostCommonHeelType.name);
            router.push(`/?${params.toString()}`);
          }}
        />

        <StatCard
          title="Most Common Location"
          value={stats.mostCommonLocation.name}
          description={`${stats.mostCommonLocation.count} shoes`}
          onClick={() => {
            const params = new URLSearchParams();
            params.append('location', stats.mostCommonLocation.name);
            router.push(`/?${params.toString()}`);
          }}
        />
      </StyledStatsGrid>

      {selectedAttribute && (
        <StyledAttributeSection>
          <h2>{selectedAttribute.charAt(0).toUpperCase() + selectedAttribute.slice(1)}</h2>
          <AddAttributeForm
            onSubmit={(e) => handleAdd(e, selectedAttribute.slice(0, -1) as 'brand' | 'color' | 'dressStyle' | 'shoeType' | 'heelType' | 'location')}
          />
          {renderTable(getAttributeList(selectedAttribute), selectedAttribute.slice(0, -1) as 'brand' | 'color' | 'dressStyle' | 'shoeType' | 'heelType' | 'location')}
        </StyledAttributeSection>
      )}
    </StyledDashboard>
  );
}
