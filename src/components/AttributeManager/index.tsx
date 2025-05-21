'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/fields/Input';
import { Button } from '@/components/Button';
import {
  StyledContainer,
  StyledTable,
  StyledTableHeader,
  StyledTableRow,
  StyledTableCell,
  StyledAddForm,
  StyledErrorMessage,
  StyledActionsCell,
  StyledShoeCount
} from './index.styled';

interface Attribute {
  id: string;
  name: string;
  shoeCount: number;
  isDeletable: boolean;
}

interface AttributeManagerProps {
  title: string;
  type: 'brand' | 'color';
}

export const AttributeManager = ({ title, type }: AttributeManagerProps) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttributes = useCallback(async () => {
    try {
      const response = await fetch('/api/attributes');
      if (!response.ok) {
        throw new Error('Failed to fetch attributes');
      }
      const data = await response.json();
      const key = `${type}s`;
      if (!data[key]) {
        throw new Error('Invalid response format');
      }
      setAttributes(data[key]);
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to fetch attributes');
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchAttributes();
  }, [type, fetchAttributes]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('Name cannot be empty');
      return;
    }
    setError('');

    try {
      const response = await fetch('/api/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name: newName.trim() })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add attribute');
      }

      setNewName('');
      fetchAttributes();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async (id: string) => {
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

      fetchAttributes();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <StyledContainer>
      <h2>{title}</h2>
      <StyledAddForm onSubmit={handleAdd}>
        <Input
          placeholder={`Add new ${type}...`}
          value={newName}
          onChange={setNewName}
          aria-label={`Add new ${type}`}
        />
      </StyledAddForm>
      {error && <StyledErrorMessage>{error}</StyledErrorMessage>}

      <StyledTable>
        <thead>
          <tr>
            <StyledTableHeader>Name</StyledTableHeader>
            <StyledTableHeader>Usage</StyledTableHeader>
            <StyledTableHeader>Actions</StyledTableHeader>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <StyledTableRow>
              <StyledTableCell colSpan={3}>Loading...</StyledTableCell>
            </StyledTableRow>
          ) : attributes.length === 0 ? (
            <StyledTableRow>
              <StyledTableCell colSpan={3}>No {type}s found</StyledTableCell>
            </StyledTableRow>
          ) : (
            attributes.map(attr => (
              <StyledTableRow key={attr.id}>
                <StyledTableCell>{attr.name}</StyledTableCell>
                <StyledTableCell>
                  <StyledShoeCount>
                    {attr.shoeCount} {attr.shoeCount === 1 ? 'shoe' : 'shoes'}
                  </StyledShoeCount>
                </StyledTableCell>
                <StyledActionsCell>
                  {attr.shoeCount === 0 && (
                    <Button
                      onClick={() => handleDelete(attr.id)}
                      aria-label={`Delete ${attr.name}`}
                      $variant="danger"
                      $size="small"
                    >
                      Delete
                    </Button>
                  )}
                </StyledActionsCell>
              </StyledTableRow>
            ))
          )}
        </tbody>
      </StyledTable>
    </StyledContainer>
  );
};
