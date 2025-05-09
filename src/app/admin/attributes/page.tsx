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
    },
    {
      id: 'finishes',
      label: 'Finishes',
      content: <AttributeManager title="Finishes" type="finish" />
    }
  ];

  return (
    <>
      <PageHeader
        title="Manage Attributes"
        description="Add, view, and delete brands, colors, and finishes. Attributes can only be deleted if they are not used by any polish."
      />
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </>
  );
}
