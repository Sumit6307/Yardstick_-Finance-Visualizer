import React from 'react';
import styled from 'styled-components';
import { useDate } from '../contexts/DateContext';

const SelectContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-right: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MonthYearSelector = () => {
  const { currentMonth, currentYear, updateDate } = useDate();

  const handleMonthChange = (e) => {
    const newDate = new Date(currentYear, e.target.value - 1, 1);
    updateDate(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(parseInt(e.target.value), currentMonth - 1, 1);
    updateDate(newDate);
  };

  return (
    <SelectContainer>
      <Select value={currentMonth} onChange={handleMonthChange}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <option key={month} value={month}>
            {new Date(currentYear, month - 1, 1).toLocaleString('default', { month: 'short' })}
          </option>
        ))}
      </Select>
      <Select value={currentYear} onChange={handleYearChange}>
        {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default MonthYearSelector;