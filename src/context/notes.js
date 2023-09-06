import React, { createContext, useContext, useState } from 'react';

const NotesContext = createContext(null); // null || []

const NotesContextProvider = ({ children }) => {
  // read
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notes, setNotes] = useState([]);

  const val = {
    loading,
    setLoading,
    error,
    setError,
    notes,
    setNotes,
  };

  return <NotesContext.Provider value={val}>{children}</NotesContext.Provider>;
};

export default NotesContextProvider;

export const useNotesContext = () => {
  return useContext(NotesContext);
};
