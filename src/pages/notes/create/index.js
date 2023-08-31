import React, { useState } from 'react';
import styles from '@/styles/CreateNote.module.css';
import useFetch from '@/utils/fetchApi';
import { useNotesContext } from '@/context/notes';
import { useRouter } from 'next/router'; // OR next/navigation

// Used as edit note component as well
const CreateNote = () => {
  // context
  const { setNotes } = useNotesContext();

  // for routing programmatically
  const router = useRouter();
  const noteId = router.query.id;
  const note = router.query;

  // create
  const [title, setTitle] = useState(note?.text ?? ''); // null || ''
  const [desc, setDesc] = useState(note?.desc ?? ''); // null || ''

  // custom hook
  const fetchApi = useFetch();

  const addNote = async (e) => {
    e.preventDefault();
    const note = {
      text: title,
      desc: desc,
      status: 'new',
    };

    const { error, resp } = await fetchApi('/api/notes', 'POST', {
      body: note,
    });

    if (error) {
      console.error(resp);
      setError(true);
    } else {
      setTitle('');
      setDesc('');
      router.push('/notes');
      setNotes((prevNotes) => [...prevNotes, resp.data]);
    }
  };

  const editNote = async (e) => {
    e.preventDefault();

    const note = {
      text: title,
      desc: desc,
    };

    const { error, resp } = await fetchApi(`/api/notes/${noteId}`, 'PATCH', {
      body: note,
    });

    if (error) {
      console.error(resp);
      setError(true);
    } else {
      setTitle('');
      setDesc('');
      router.push('/notes');
      setNotes(resp.data);
    }
  };

  return (
    <div className={styles.notes_form_wrapper}>
      {/* <div className={styles.left}>
        <Image
          src="http://unsplash.it/450"
          width={400}
          height={400}
          alt="create note"
        />
      </div> */}
      <div className={styles.right}>
        <h1 className="text-4xl mb-5">Create Note</h1>
        <form
          onSubmit={noteId ? editNote : addNote}
          className={styles.notes_form}
        >
          <div className={styles.form_input}>
            <p className={styles.form_label}>Title</p>
            <input
              type="text"
              placeholder="Enter a note"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // /className={}
            />
          </div>
          <div className={styles.form_input}>
            <p className={styles.form_label}>Description</p>
            <textarea
              rows="4"
              placeholder="Enter description for the note"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <button type="submit" className="btn_outline">
            {noteId ? 'Edit' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
