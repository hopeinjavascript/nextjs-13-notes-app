import useFetch from '@/utils/fetchApi';
import React, { useState, useEffect } from 'react';

import styles from '@/styles/Notes.module.css';

const notes = () => {
  // read
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [notes, setNotes] = useState([]);

  // create
  const [newNote, setNewNote] = useState('');

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

  const addNote = async (e) => {
    e.preventDefault();
    console.log({ newNote });

    const note = {
      text: newNote,
      desc: newNote,
      status: 'new',
    };

    const { error, resp } = await fetchApi('/api/notes', 'POST', {
      body: note,
    });

    if (error) {
      console.error(resp);
      setError(true);
    } else {
      setNewNote('');
      setNotes((prevNotes) => [...prevNotes, resp.data]);
    }
  };

  return (
    <div className={styles.notes_wrapper}>
      {/* <h1 className={styles.heading}>Your notes</h1> */}

      <div className={styles.notes_form}>
        <form onSubmit={addNote} className={styles.form}>
          <input
            type="text"
            placeholder="Enter a note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            // /className={}
          />
          <button type="submit" className="btn_primary">
            Add
          </button>
        </form>
      </div>

      <div className={styles.notes_container}>
        {loading && <h1>Loading...</h1>}
        {error && <h1>Error in fetching your notes...</h1>}
        {!notes.length ? (
          <h1>There are no notes available</h1>
        ) : (
          notes.map((note) => {
            return (
              <div className={styles.note} key={note.id}>
                <h1 className={styles.text}>{note.text}</h1>
                <p>
                  {note.desc.length > 50
                    ? `${note.desc.substring(0, 50)}...`
                    : note.desc}
                </p>
                <p>status - {note.status}</p>
                <p>createdBy - {note.createdBy}</p>
                {/* <hr /> */}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default notes;
