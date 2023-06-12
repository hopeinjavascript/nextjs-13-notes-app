import { notes } from '@/../data/notes';

// req, res, next are standard node js's objects
export default async function handler(req, res, next) {
  req.name = 'new user';
  const apiHandlers = {
    GET: () => res.status(200).json({ message: 'Notes', data: notes }),
    POST: () => {
      console.log(req.body);
      const newNote = {
        id: notes.length,
        ...req.body,
        createdBy: req.name,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };

      notes.push(newNote);
      res.status(201).json({ message: 'Note created', data: newNote });
    },
  };

  return apiHandlers[req.method]();
}
