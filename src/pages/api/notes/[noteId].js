import NoteModel from '@/models/note';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import setResponse from '@/utils/setResponse';

// req, res, next are standard node js's objects
export default async function handler(req, res, next) {
  const response = setResponse(res);

  const session = await getServerSession(req, res, authOptions);

  if (!session) return response.unauthorized('you are not authenticated');

  const apiHandlers = {
    GET: async () => {
      const { noteId } = req.query;

      if (!noteId) return response.badRequest('Note id is required');

      const note = await NoteModel.findById({ _id: noteId });

      if (!note)
        return response.notFound('No note found with provided id ' + noteId);

      return response.success('Note', note);
    },
    DELETE: async () => {
      const { noteId } = req.query;

      if (!noteId) return response.badRequest('Note id is required');

      const deletedNote = await NoteModel.findByIdAndDelete({ _id: noteId });

      if (!deletedNote)
        return response.internalServerError('Error deleting note');

      return response.success('Note deleted', deletedNote);
    },
    PATCH: async () => {
      const { noteId } = req.query;

      if (!noteId) return response.badRequest('Note id is required');

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
        return response.internalServerError('Error editing note');

      return response.success('Note edited', editedNote);
    },
  };

  return apiHandlers[req.method]();
}
