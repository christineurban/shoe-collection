'use client';

import { AttributeManager } from '@/components/AttributeManager';
import { PageHeader } from '@/components/PageHeader';
import { Tabs } from '@/components/Tabs';
import { useState } from 'react';

export default function AttributesPage() {
  const [activeTab, setActiveTab] = useState('brands');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <PageHeader title="Loading..." />
    );
  }

  if (error) {
    return (
      <PageHeader
        title="Error"
        description={error}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Manage Attributes"
        description="Add, view, and delete brands and colors. Attributes can only be deleted if they are not used by any shoe."
      />
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </>
  );
}
