import React, { useState } from 'react';
import styled from 'styled-components';

const ColorPickerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ColorOption = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  padding: 0;
  background: ${({ color }) => color};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const ColorInput = styled.input`
  width: 100%;
  margin-top: 0.5rem;
`;

const DEFAULT_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
];

const ColorPicker = ({ color, onChange }) => {
  const [customColor, setCustomColor] = useState(color);
  const [showCustom, setShowCustom] = useState(!DEFAULT_COLORS.includes(color));

  const handleColorSelect = (selectedColor) => {
    onChange(selectedColor);
    setCustomColor(selectedColor);
    setShowCustom(false);
  };

  const handleCustomColorChange = (e) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div>
      <ColorPickerContainer>
        {DEFAULT_COLORS.map((defaultColor) => (
          <ColorOption
            key={defaultColor}
            color={defaultColor}
            $isSelected={color === defaultColor && !showCustom}
            onClick={() => handleColorSelect(defaultColor)}
            title={defaultColor}
          />
        ))}
        <ColorOption
          color={customColor}
          $isSelected={showCustom}
          onClick={() => setShowCustom(true)}
          title="Custom color"
        />
      </ColorPickerContainer>

      {showCustom && (
        <ColorInput
          type="color"
          value={customColor}
          onChange={handleCustomColorChange}
        />
      )}
    </div>
  );
};

export default ColorPicker;