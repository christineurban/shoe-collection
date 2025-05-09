import { useState } from 'react';
import { StyledForm, StyledInput, StyledButton } from './index.styled';

interface AddAttributeFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

export const AddAttributeForm = ({ onSubmit }: AddAttributeFormProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(e);
    setName('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledInput
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Enter name..."
        aria-label="Attribute name"
      />
      <StyledButton type="submit">Add</StyledButton>
    </StyledForm>
  );
};
