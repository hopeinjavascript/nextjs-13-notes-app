import NoteModel from '@/models/note';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// req, res, next are standard node js's objects
export default async function handler(req, res, next) {
  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return res.json({ msg: 'you are not authenticated', status: 401 });

  const apiHandlers = {
    DELETE: async () => {
      const { noteId } = req.query;

      if (!noteId)
        return res
          .status(200)
          .json({ msg: 'Note id is required', status: 400 });

      const deletedNote = await NoteModel.findByIdAndDelete({ _id: noteId });

      if (!deletedNote)
        return res.json({ msg: 'Error deleting note', status: 500 });

      res
        .status(200)
        .json({ msg: 'Deleted Note', status: 200, data: deletedNote });
    },
    PATCH: async () => {
      const { noteId } = req.query;

      if (!noteId)
        return res
          .status(200)
          .json({ msg: 'Note id is required', status: 400 });

      let editedNote = await NoteModel.findByIdAndUpdate(
        { _id: noteId },
        { ...req.body, updatedAt: new Date().toLocaleString() },
        { new: true }
      );

      editedNote = await editedNote.populate(
        'createdBy',
        'name username email'
      );

      if (!editedNote)
        return res.json({ msg: 'Error editing note', status: 500 });

      res
        .status(200)
        .json({ msg: 'Edited Note', status: 200, data: editedNote });
    },
  };

  return apiHandlers[req.method]();
}
