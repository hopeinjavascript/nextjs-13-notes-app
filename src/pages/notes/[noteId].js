import styles from '@/styles/SingleNote.module.css';
import { fetchNoteById } from '@/utils/fetchApi';
import { getSession } from 'next-auth/react';

/*
Note: Here we are using the data sent from master list page

> There are three possible approaches
    1. sent data from master list page
      - [ get the query param using useRouter ] -> this will not work if you refresh the page,
    2. make an api call client side using useEffect (recommended over 1st approach if data is going to be large)  
      - [ get the query param using useRouter and make a fetch call ]
    3. use getServerSideProps to grab the dynamic route query param (recommended over 2nd approach if data is going to be large and if you want to take the advantage of pre-rendering) 
      - [ get query param in context arg and make a fetch call]
*/

const Note = ({ note }) => {
  return (
    <div className={styles.note} key={note._id}>
      <h1 className={styles.text}>{note.title}</h1>
      <p className={styles.desc}>{note.desc}</p>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const noteId = context.query.noteId;

  if (!session) {
    return {
      redirect: {
        destination: `${process.env.NEXTAUTH_URL}/auth/signIn`,
        permanent: false,
      },
    };
  }

  const note = await fetchNoteById(context, noteId);

  return {
    props: {
      session,
      note: note.data,
    },
  };
}

export default Note;
