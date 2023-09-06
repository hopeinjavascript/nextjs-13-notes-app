import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const ThemeContext = createContext('dark'); // null || []

const ThemeContextProvider = ({ children }) => {
  // read
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark');

    return () => {};
  }, []);

  const toggleTheme = () => {
    const updatedTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', updatedTheme);
    setTheme(updatedTheme);
  };

  const val = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={val}>
      <div className={`app-wrapper ${theme}`}>{children} </div>
      {/* {children} */}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
