import React from 'react';
import { notes } from '@/../data/notes';
import styles from '@/styles/SingleNote.module.css';

const Note = ({ note }) => {
  return (
    <div className={styles.note} key={note._id}>
      <h1 className={styles.text}>{note.title}</h1>
      <p className={styles.desc}>{note.desc}</p>
    </div>
  );
};

export async function getStaticPaths() {
  /**
   * Server Error
    Error: A required parameter (noteId) was not provided as a string received number in getStaticPaths for /notes/[noteId]
    This error happened while generating the page. Any console logs will be displayed in the terminal window.
  **/

  // noteId refers to the file name
  return {
    paths: [
      { params: { noteId: '1' } }, // values should be string
      { params: { noteId: '2' } },
      { params: { noteId: '3' } },
      { params: { noteId: '4' } },
    ],
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const {
    params: { noteId },
  } = context;

  /*
  DO THIS when you already have data available
  */
  const note = notes.find((note) => note.id === parseInt(noteId));

  //destructing because it is giving error of serialization on date object
  const { id, text, desc, status, createdBy } = note;

  /*
  DO NOT DO THIS
  we should not call our own API routes for pre-rendering content as it might cause unnecessary roundtrip/delay, this can save you approx 100ms
  The fact is that it is advised/recommended not to call our own API routes from getStaticProps or getServerSideProps
  you may call any external API routes
  */
  // const res = await fetch(`/api/notes/${noteId}`);
  // const note = await res.json();

  return {
    props: { note: { id, text, desc, status, createdBy } },
  };
}

export default Note;
