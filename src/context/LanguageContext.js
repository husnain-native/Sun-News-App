import React, { createContext, useContext, useState } from 'react';

// Create the context
const LanguageContext = createContext();

// Provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default is English
  const [activeCategory, setActiveCategory] = useState(null);

  // Function to toggle between English and Urdu
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
    setActiveCategory(null); // Reset category on language change
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      toggleLanguage,
      activeCategory,
      setActiveCategory 
    }}>
      {children} 
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
