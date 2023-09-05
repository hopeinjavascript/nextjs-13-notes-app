import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import NoteModel from '@/models/note';
import connectToDB from '@/connections/mongoose';
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

  // TODO: change session.expires value, currently it is one month
  const session = await getServerSession(req, res, authOptions);
  const apiHandlers = {
    GET: async () => {
      await connectToDB();
      const notes = await NoteModel.find({
        createdBy: session?.user.id,
      }).populate('createdBy', 'name username email');

      res.status(200).json({
        message: 'Notes',
        status: 200,
        data: notes,
      });
    },
    POST: async () => {
      await connectToDB();

      const note = {
        // id: notes.length + 1,
        ...req.body,
        createdBy: session?.user.id,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };

      const newNote = new NoteModel(note);
      let savedNote = await newNote.save();

      savedNote = await savedNote.populate('createdBy', 'name username email');

      if (!savedNote)
        return res.json({ msg: 'Error creating note', status: 500 });

      return res.json({
        msg: 'Note created',
        status: 200,
        data: savedNote,
      });
    },
  };

  return apiHandlers[req.method]();
}
