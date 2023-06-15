import React, { useState } from 'react';
import styles from '@/styles/CreateNote.module.css';
import useFetch from '@/utils/fetchApi';
import { useNotesContext } from '@/context/notes';
import { useRouter } from 'next/router'; // OR next/navigation
import Image from 'next/image';

const CreateNote = () => {
  // context
  const { setNotes } = useNotesContext();

  // create
  const [title, setTitle] = useState(null); // null || ''
  const [desc, setDesc] = useState(null); // null || ''

  // custom hook
  const fetchApi = useFetch();

  // for routing programmatically
  const router = useRouter();

  const addNote = async (e) => {
    e.preventDefault();
    console.log({ title, desc });
    debugger;
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
        <form onSubmit={addNote} className={styles.notes_form}>
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
          <button type="submit" className="btn_primary">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
