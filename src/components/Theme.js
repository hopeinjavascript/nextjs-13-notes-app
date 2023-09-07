import React from 'react';
import { useThemeContext } from '@/context/theme';
import { FaMoon, FaSun } from 'react-icons/fa';

const Theme = () => {
  const themeContext = useThemeContext();

  return (
    <div>
      <input
        type="checkbox"
        className="checkbox"
        id="checkbox"
        onChange={() => themeContext.toggleTheme()}
      />
      <label htmlFor="checkbox" className="checkbox-label">
        <FaMoon className="fas fa-moon" />
        <FaSun className="fas fa-sun" />
        <span className="ball"></span>
      </label>
    </div>
  );
};

export default Theme;
