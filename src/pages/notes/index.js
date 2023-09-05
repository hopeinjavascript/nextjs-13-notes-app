import useFetch from '@/utils/fetchApi';
import { useNotesContext } from '@/context/notes';
import styles from '@/styles/Notes.module.css';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Notes = () => {
  // context
  const { loading, error, setError, notes, setNotes } = useNotesContext();

  const session = useSession();
  console.log(session);

  // custom hook
  const fetchApi = useFetch();

  const deleteNote = async (noteId) => {
    const { error, resp } = await fetchApi(`/api/notes/${noteId}`, 'DELETE');

    if (error) {
      console.error(resp);
      setError(true);
    } else {
      const updatedNotes = notes.filter((note) => note._id !== resp.data._id);
      setNotes(updatedNotes);
    }
  };

  return (
    <div className={styles.notes_wrapper}>
      <Link href="/">Home</Link>
      <header className={styles.notes_header}>
        <h1 className={styles.heading}>{'   '}Your notes</h1>
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
            const noteId = note._id;
            return (
              <div className={styles.note} key={noteId}>
                <div className={styles.note_content}>
                  <Link href={`/notes/${noteId}`}>
                    <h1 className={styles.text}>{note.title}</h1>
                  </Link>

                  <p className={styles.desc}>
                    {note.desc.length > 50
                      ? `${note.desc.substring(0, 50)}...`
                      : note.desc}
                  </p>
                  <p>status - {note.status}</p>
                  <p>createdBy - {note.createdBy.name}</p>
                </div>
                {/* <hr /> */}
                <div className={styles.note_cta}>
                  <button onClick={() => deleteNote(noteId)}>Delete</button>
                  <Link
                    href={{
                      pathname: `/notes/create`,
                      // search: { noteId: noteId },
                      query: note,
                    }}
                    as={`/notes/edit?noteId=${noteId}`}
                  >
                    <button>Edit</button>
                  </Link>
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
