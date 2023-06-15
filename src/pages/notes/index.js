import useFetch from '@/utils/fetchApi';
import { useNotesContext } from '@/context/notes';
import styles from '@/styles/Notes.module.css';
import Link from 'next/link';

const Notes = () => {
  // context
  const { loading, error, notes, setNotes } = useNotesContext();

  // custom hook
  const fetchApi = useFetch();

  const deleteNote = async (noteId) => {
    const { error, resp } = await fetchApi(`/api/notes/${noteId}`, 'DELETE', {
      body: { noteId },
    });

    if (error) {
      console.error(resp);
      setError(true);
    } else {
      const updatedNotes = notes.filter((note) => note.id !== resp.data.id);
      setNotes(updatedNotes);
    }
  };

  return (
    <div className={styles.notes_wrapper}>
      <header className={styles.notes_header}>
        <h1 className={styles.heading}>Your notes</h1>
        <Link href="/notes/create">
          <button className="btn_outline">Create note</button>
        </Link>
      </header>

      <div className={styles.notes_container}>
        {loading && <h1>Loading...</h1>}
        {error && <h1>Error in fetching your notes...</h1>}
        {!notes.length ? (
          <h1>There are no notes available</h1>
        ) : (
          notes.map((note) => {
            return (
              <div className={styles.note} key={note.id}>
                <div className={styles.note_content}>
                  <Link href={`/notes/${note.id}`}>
                    <h1 className={styles.text}>{note.text}</h1>
                  </Link>

                  <p>
                    {note.desc.length > 50
                      ? `${note.desc.substring(0, 50)}...`
                      : note.desc}
                  </p>
                  <p>status - {note.status}</p>
                  <p>createdBy - {note.createdBy}</p>
                </div>
                {/* <hr /> */}
                <div className={styles.note_cta}>
                  <button onClick={() => deleteNote(note.id)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notes;
