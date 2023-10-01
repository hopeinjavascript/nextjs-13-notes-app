import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import NoteModel from '@/models/note';
import connectToDB from '@/connections/mongoose';
import setResponse from '@/utils/setResponse';
// import { getSession } from 'next-auth/react'; // to be use on server side - getServerSideProps, getStat
// import { getToken } from 'next-auth/jwt';

// req, res, next are standard node js's objects
export default async function handler(req, res, next) {
  // console.log(req.cookies); OR await getServerSession(req, res, authOptions);

  // const token = await getToken({
  //   req,
  //   cookieName: req.cookies['next-auth.session-token'],
  //   secret: process.env.NEXTAUTH_SECRET,
  // });

  const response = setResponse(res);

  // TODO: change session.expires value, currently it is one month
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return response.unauthorized('you are not authenticated');
  }

  const apiHandlers = {
    GET: async () => {
      await connectToDB();
      const notes = await NoteModel.find({
        createdBy: session?.user.id,
      }).populate('createdBy', 'name username email');

      return response.success('Notes', notes);
    },
    POST: async () => {
      await connectToDB();

      const { title, desc } = req.body;

      if (!title || !desc) {
        return response.badRequest('Fill in all the fields');
      }

      const note = {
        // id: notes.length + 1,
        ...req.body,
        createdBy: session?.user.id,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };

      const newNote = new NoteModel(note);
      let savedNote = await newNote.save();

      if (!savedNote) {
        return response.internalServerError('Error creating note');
      }

      savedNote = await savedNote.populate('createdBy', 'name username email');

      return response.created('Note created', savedNote);
    },
  };

  return apiHandlers[req.method]();
}
