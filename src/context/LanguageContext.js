import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
I18nManager.allowRTL(false);

const LanguageContext = createContext();
const LANGUAGE_KEY = '@app_language';
const DIRECTION_KEY = '@app_direction'; // New key for direction

export const LanguageProvider = ({ children, initialLanguage = 'en' }) => {
  const [language, setLanguage] = useState(initialLanguage);
  const [activeCategory, setActiveCategory] = useState(null);
  const [direction, setDirection] = useState(initialLanguage === 'ur' ? 'ltr' : 'ltr'); // Initial direction based on language

  // Load persisted language and direction on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        const storedDirection = await AsyncStorage.getItem(DIRECTION_KEY);
        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
        if (storedDirection) {
          setDirection(storedDirection);
        } else {
          // Fallback to language-based direction if no stored direction
          setDirection(storedLanguage === 'ur' ? 'ltr' : 'ltr');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setDirection(initialLanguage === 'ur' ? 'ltr' : 'ltr'); // Fallback
      }
    };
    loadSettings();
  }, [initialLanguage]);

  // Sync direction with language changes and persist both
  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'ur' : 'en';
    const newDirection = newLanguage === 'ur' ? 'ltr' : 'ltr';
    
    setLanguage(newLanguage);
    setDirection(newDirection);
    setActiveCategory(null); // Reset category on language change

    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
      await AsyncStorage.setItem(DIRECTION_KEY, newDirection);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
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