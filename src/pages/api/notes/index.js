import { notes } from '@/../data/notes';

// req, res, next are standard node js's objects
export default async function handler(req, res, next) {
  const apiHandlers = {
    GET: () => res.status(200).json({ message: 'Notes', data: notes }),
  };

  return apiHandlers[req.method]();
}
