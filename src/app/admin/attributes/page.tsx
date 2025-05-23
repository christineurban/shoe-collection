'use client';

import { AttributeManager } from '@/components/AttributeManager';
import { PageHeader } from '@/components/PageHeader';
import { Tabs } from '@/components/Tabs';
import { useState } from 'react';
import { StyledContainer } from './page.styled';

export default function AttributesPage() {
  const [activeTab, setActiveTab] = useState('brands');
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const tabs = [
    {
      id: 'brands',
      label: 'Brands',
      content: <AttributeManager title="Brands" type="brand" />
    },
    {
      id: 'colors',
      label: 'Colors',
      content: <AttributeManager title="Colors" type="color" />
    }
  ];

  if (isLoading) {
    return (
      <StyledContainer>
        <PageHeader title="Loading..." />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <PageHeader
          title="Error"
          description={error}
        />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <PageHeader
        title="Manage Attributes"
        description="Add, view, and delete brands and colors. Attributes can only be deleted if they are not used by any shoe."
      />
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </StyledContainer>
  );
}
