import React, { useState } from 'react';
import styles from '@/styles/CreateNote.module.css';
import useFetch from '@/utils/fetchApi';
import { useNotesContext } from '@/context/notes';
import { useRouter } from 'next/router'; // OR next/navigation
import { getSession, useSession } from 'next-auth/react';
import { HiPlus } from 'react-icons/hi';
import { AiOutlineEdit } from 'react-icons/ai';
import IconButton from '@/components/IconButton';
import Loader from '@/components/Loader';

// Used as edit note component as well
const CreateNote = () => {
  // context
  const { notes, setNotes, setError } = useNotesContext();

  const [loading, setLoading] = useState(false);

  // for routing programmatically
  const router = useRouter();
  const noteId = router.query._id;
  const note = router.query;

  // const session = useSession();
  // console.log(session);

  // refer pt (1.)
  // * this doesn't work on the client side because session is evaluated when page is loaded
  // * it is initially in the loading state and then it is evaluated to be authenticated/unauthenticated
  // useEffect(() => {
  //   console.log('session');
  //   if (!session.data || session.status === 'unauthenticated') {
  //     router.push('/auth/signIn');
  //   }
  // }, []);

  // create
  const [title, setTitle] = useState(note?.title ?? ''); // null || ''
  const [desc, setDesc] = useState(note?.desc ?? ''); // null || ''

  // custom hook
  const fetchApi = useFetch();

  const addNote = async (e) => {
    e.preventDefault();

    setLoading(true);

    const note = {
      title: title,
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

    setLoading(false);
  };

  const editNote = async (e) => {
    e.preventDefault();

    setLoading(true);

    const note = {
      title: title,
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
      const updatedNotes = notes.map((note) => {
        if (note._id === resp.data._id) {
          return resp.data;
        }

        return note;
      });
      setNotes(updatedNotes);
      router.push('/notes');
    }

    setLoading(false);
  };

  return (
    <div className={styles.form_wrapper}>
      {/* <div className={styles.left}>
        <Image
          src="http://unsplash.it/450"
          width={400}
          height={400}
          alt="create note"
        />
      </div> */}
      <div className={styles.right}>
        <h1 className="text-4xl mb-5">
          {noteId ? 'Edit Note' : 'Create Note'}
        </h1>
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
          {loading ? (
            noteId ? (
              <IconButton
                btnText="Editing"
                btnIcon={<Loader />}
                btnType="primary"
                isLoading={loading}
              />
            ) : (
              <IconButton
                btnText="Adding"
                btnIcon={<Loader />}
                btnType="primary"
                isLoading={loading}
              />
            )
          ) : noteId ? (
            <IconButton
              btnText="Edit"
              btnIcon={<AiOutlineEdit />}
              btnType="primary"
              isLoading={loading}
            />
          ) : (
            <IconButton
              btnText="Add"
              btnIcon={<HiPlus />}
              btnType="primary"
              isLoading={loading}
            />
          )}
        </form>
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

  return {
    props: {
      // (1.)
      // when we send this, it is received in the client side as an evaluated session (whether authenticated/unauthenticated) via SessionProvider. useSession first checks for session passed by SessionProvider and hence, it is always in the "authenticated/unauthenticated" mode, there is no "loading" status.
      session,
    },
  };
}

export default CreateNote;
