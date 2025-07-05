import React, { createContext, useState, useEffect } from 'react';

const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonthName, setCurrentMonthName] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleString('default', { month: 'long' })
  );

  const updateDate = (newDate) => {
    setCurrentDate(newDate);
    setCurrentMonth(newDate.getMonth() + 1);
    setCurrentYear(newDate.getFullYear());
    setCurrentMonthName(
      new Date(newDate.getFullYear(), newDate.getMonth(), 1).toLocaleString('default', { month: 'long' })
    );
  };

  return (
    <DateContext.Provider
      value={{
        currentDate,
        currentMonth,
        currentYear,
        currentMonthName,
        updateDate
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => React.useContext(DateContext);