'use client';

import { ReactNode } from 'react';
import { StyledTabList, StyledTab, StyledTabPanel } from './index.styled';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  return (
    <div>
      <StyledTabList role="tablist">
        {tabs.map((tab) => (
          <StyledTab
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            $active={activeTab === tab.id}
          >
            {tab.label}
          </StyledTab>
        ))}
      </StyledTabList>
      {tabs.map((tab) => (
        <StyledTabPanel
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={tab.id}
          hidden={activeTab !== tab.id}
        >
          {tab.content}
        </StyledTabPanel>
      ))}
    </div>
  );
};
