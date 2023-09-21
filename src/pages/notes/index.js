import { useEffect, useState } from 'react';
import { useNotesContext } from '@/context/notes';
import styles from '@/styles/Notes.module.css';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import useFetch, { fetchNotes } from '@/utils/fetchApi';
import { useRouter } from 'next/router';
import { BiAddToQueue } from 'react-icons/bi';
import IconButton from '@/components/IconButton';

const Notes = ({ notes }) => {
  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  // https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
  const refreshData = () => {
    router.replace(router.asPath); // * WORK AROUND?
  };
  // context
  const { loading, error, setError, setNotes, setLoading } = useNotesContext();

  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [checkedValues, setCheckedValues] = useState([]);

  const fetchApi = useFetch();

  useEffect(() => {
    setNotes(notes);
    setUniqueStatuses([...new Set(notes.map((note) => note.status))]);
  }, [notes, setNotes]);

  // * Not needed refer pt (1.)
  // wrapping it in useEffect for ERROR: cannot update a component while rendering a different component
  // useEffect(() => {
  //   if (notes?.length) {
  //     setLoading(false);
  //   }
  // }, [notes]);

  const deleteNote = async (noteId) => {
    const { error, resp } = await fetchApi(`/api/notes/${noteId}`, 'DELETE');

    if (error) {
      console.error(resp);
      setError(true);
    } else {
      const updatedNotes = notes.filter((note) => note._id !== resp.data._id);
      setNotes(updatedNotes); // context
      setFilteredNotes(updatedNotes); // local state
      refreshData();
    }
  };

  // * client side filtering
  const handleFilter = (e) => {
    const value = e.target.value,
      checked = e.target.checked;

    if (checked) {
      checkedValues.push({ checked, value });
    } else {
      // we are not changing the checked property to false here
      // we are directly removing the obj from the array
      const index = checkedValues.findIndex(
        (checkedObj) => checkedObj.value === value
      );
      checkedValues.splice(index, 1);
    }

    let updatedNotes = [];
    if (checkedValues.length > 0) {
      updatedNotes = notes.filter((note) =>
        // checkedValues.find(
        //   (checkedObj) => checkedObj.value === note.status && note
        // )
        checkedValues.some((checkedObj) => checkedObj.value === note.status)
      );
    } else {
      updatedNotes = notes;
    }
    setFilteredNotes(updatedNotes);
  };

  const clearFilter = () => {
    setFilteredNotes(notes);
    setCheckedValues([]);
  };

  return (
    <div className={styles.notes_wrapper}>
      <header className={styles.notes_header}>
        {/* <h1 className={styles.heading}>{'   '}Your notes</h1> */}
        <div className={styles.filter}>
          <span className={styles.clear_filter} onClick={clearFilter}>
            Clear
          </span>
          {uniqueStatuses.map((note) => (
            <div key={note}>
              <input
                className="checkbox"
                type="checkbox"
                onChange={handleFilter}
                value={note}
                id={note}
                // maintaining checked state for clearing filter
                checked={checkedValues.some(
                  (checkedObj) => checkedObj.value === note
                )}
              />
              <label
                htmlFor={note}
                key={note}
                className={`checkbox-label filter-checkbox-label`}
              >
                {note}
              </label>
            </div>
          ))}
        </div>
        <Link href="/notes/create">
          <IconButton
            btnText="Create Note"
            btnIcon={<BiAddToQueue />}
            btnType="primary"
            isLoading={loading}
          />
        </Link>
      </header>

      <div className={styles.notes_container}>
        {/*  (1.)
            below two condition are not needed as data is fetch and pre-rendered server side
            if there is any error  then it will be on the server
            // * we can think of putting loading state ?
        */}
        {/* {loading && <h1>Loading...</h1>}
        {error && <h1>Error in fetching your notes...</h1>} */}
        {!filteredNotes.length ? (
          <h1>There are no notes available</h1>
        ) : (
          filteredNotes.map((note) => {
            const noteId = note._id;
            const status =
              note.status === 'new'
                ? styles.badge_new
                : note.status === 'progress'
                ? styles.badge_progress
                : styles.badge_completed;

            return (
              <div className={styles.note} key={noteId}>
                <div className={styles.note_content}>
                  <Link
                    href={{
                      pathname: `/notes/${noteId}`,
                      query: noteId,
                    }}
                    as={`/notes/${noteId}`}
                  >
                    <h1 className={styles.text}>
                      {note.title.length > 10
                        ? `${note.title.substring(0, 10)}...`
                        : note.title}
                    </h1>
                  </Link>

                  <p className={styles.desc}>
                    {note.desc.length > 50
                      ? `${note.desc.substring(0, 45)}...`
                      : note.desc}
                  </p>
                  {/* <p className={`${styles.badge} ${status}`}>
                    <strong>{note.status}</strong>
                  </p> */}
                  <p className={`flex justify-between items-center mt-3`}>
                    <em> - {note.createdBy.name}</em>
                    <strong className={`${styles.badge} ${status}`}>
                      {note.status}
                    </strong>
                  </p>
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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: `${process.env.NEXTAUTH_URL}/auth/signIn`,
        permanent: false,
      },
    };
  }

  // https://stackoverflow.com/questions/76298869/nextauth-js-getserversession-return-null-even-after-user-is-sign-in
  const notes = await fetchNotes(context);

  return {
    props: {
      session,
      notes: notes.data,
    },
  };
}

export default Notes;
