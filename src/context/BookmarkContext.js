import React, { createContext, useState, useContext } from "react";

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  const toggleBookmark = (item) => {
    setBookmarkedItems((prev) =>
      prev.some((b) => b.id === item.id)
        ? prev.filter((b) => b.id !== item.id) // Remove if already exists
        : [...prev, item] // Add new item
    );
  };

  return (
    <BookmarkContext.Provider value={{ bookmarkedItems, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

// Custom hook for easy access
export const useBookmarks = () => useContext(BookmarkContext);
