import { notes } from '@/../data/notes';

// req, res, next are standard node js's objects
export default async function handler(req, res, next) {
  const apiHandlers = {
    DELETE: () => {
      const { noteId } = req.query;

      //to send it to the frontend
      const deletedNote = notes.find((note) => note.id === parseInt(noteId));

      // deleting the note
      const noteIndex = notes.findIndex((note) => note.id === parseInt(noteId));
      notes.splice(noteIndex, 1);

      // console.log(notes);

      res.status(200).json({ message: 'Deleted Note', data: deletedNote });
    },
    PATCH: () => {
      res.status(200).json({ message: 'PATCH request', data: '' });
    },
  };

  return apiHandlers[req.method]();
}
