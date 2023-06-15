import useFetch from '@/utils/fetchApi';
import React, { createContext, useContext, useState, useEffect } from 'react';

const NotesContext = createContext(null); // null || []

const NotesContextProvider = ({ children }) => {
  // read
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [notes, setNotes] = useState([]);

  // custom hook
  const fetchApi = useFetch();

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);

      const { error, resp, abortRequest } = await fetchApi('/api/notes');

      if (error) {
        console.error(resp);
        setError(true);
      } else {
        setNotes(resp.data);
      }
    }

    fetchNotes().finally(() => setLoading(false));

    return () => {
      //   abortRequest();
    };
  }, []);

  const val = {
    loading,
    error,
    notes,
    setNotes,
  };

  return <NotesContext.Provider value={val}>{children}</NotesContext.Provider>;
};

export default NotesContextProvider;

export const useNotesContext = () => {
  return useContext(NotesContext);
};
