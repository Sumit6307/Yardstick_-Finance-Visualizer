import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categories');
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category) => {
    try {
      const { data } = await axios.post('/api/categories', category);
      setCategories([...categories, data]);
      return { success: true, category: data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const { data } = await axios.put(`/api/categories/${id}`, updates);
      setCategories(categories.map(c => c._id === id ? data : c));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);