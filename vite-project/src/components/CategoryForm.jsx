import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCategories } from '../contexts/CategoriesContext';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import ColorPicker from './ui/ColorPicker';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ColorPreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  margin: 0 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CategoryForm = ({ category, onClose }) => {
  const { addCategory, updateCategory } = useCategories();
  const [formData, setFormData] = useState({
    name: '',
    color: '#6b7280',
    icon: 'tag'
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
        icon: category.icon || 'tag'
      });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category) {
      await updateCategory(category._id, formData);
    } else {
      await addCategory(formData);
    }
    onClose();
  };

  return (
    <Modal title={category ? 'Edit Category' : 'Add Category'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormContainer>
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <FormGroup>
            <label>Color</label>
            <ColorPicker
              color={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
            />
            <ColorPreview color={formData.color} />
          </FormGroup>

          <Button type="submit" variant="primary">
            {category ? 'Update' : 'Create'} Category
          </Button>
        </FormContainer>
      </form>
    </Modal>
  );
};

export default CategoryForm;