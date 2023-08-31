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
      const { noteId } = req.query;

      //to send it to the frontend
      const editedNote = notes.find((note) => note.id === parseInt(noteId));

      // updating the note
      const updatedNotes = notes.map((note) => {
        if (note.id === parseInt(noteId)) {
          return {
            ...note,
            ...req.body,
            updatedAt: new Date().toLocaleString(),
          };
        }
        return note;
      });

      console.log(updatedNotes);

      // sending updatedNotes (and not editedNote) directly to save processing on frontend
      // if you delete a few notes and then update a note, upon sending updatedNotes will send all the notes including the ones which were deleted. WHY?
      // because Next JS apis are serverless function, they are invoked every time the function is called
      // so basically it will send all the notes (edited one too) as we are not persisting in the database
      res.status(200).json({ message: 'Edited Note', data: updatedNotes });
    },
  };

  return apiHandlers[req.method]();
}
