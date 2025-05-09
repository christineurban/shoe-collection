'use client';

import { AttributeManager } from '@/components/AttributeManager';
import { PageHeader } from '@/components/PageHeader';
import styled from 'styled-components';
import { Tabs } from '@/components/Tabs';
import { useState } from 'react';

export default function AttributesPage() {
  const [activeTab, setActiveTab] = useState('brands');

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
