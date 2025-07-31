import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
I18nManager.allowRTL(false);

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Always start in English
  const [language, setLanguage] = useState('en');
  const [activeCategory, setActiveCategory] = useState(null);
  const [direction, setDirection] = useState('ltr'); // Always ltr for English

  // On mount, always reset to English
  useEffect(() => {
    setLanguage('en');
    setDirection('ltr');
  }, []);

  // Allow switching language in-session, but do not persist
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ur' : 'en';
    const newDirection = newLanguage === 'ur' ? 'ltr' : 'ltr'; // Adjust if you want rtl for urdu
    setLanguage(newLanguage);
    setDirection(newDirection);
    setActiveCategory(null); // Reset category on language change
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        toggleLanguage,
        activeCategory,
        setActiveCategory,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);