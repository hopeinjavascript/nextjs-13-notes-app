import connectToDB from '@/connections/mongoose';
import UserModel from '@/models/user';
import bcrypt from 'bcryptjs';
import setResponse from '@/utils/setResponse';

// req, res, next are standard node js's objects
export default async function handler(req, res, next) {
  const response = setResponse(res);

  const apiHandlers = {
    POST: async () => {
      await connectToDB();

      const { name, email, username, password } = req.body;

      if (!name || !email || !password)
        return response.badRequest('All fields are required');

      const user = await UserModel.findOne({ email });

      if (user?.email) return response.badRequest('User/Email already exists');

      req.body['username'] = username
        ? username
        : name.toLowerCase().replace(/ /g, '');

      // below condition automatically validates minLength as defined in the UserModel
      // because it tries to save and if mongoose doesn't find it having a length of 8 then it throws error
      // if below condition is not provided then even 6 chars password will be inserted
      // because it is hashed before inserting so it becomes > 8
      if (password.length >= 8) {
        const hashedPassword = await bcrypt.hash(password, 12);
        req.body.password = hashedPassword;
      }

      const newUser = new UserModel(req.body);
      const savedUser = await newUser.save();

      if (!savedUser) return response.internalServerError('Signup failed');

      return response.success('Signup Successful', savedUser);
    },
  };

  return apiHandlers[req.method]();
}
