import connectToDB from '@/connections/mongoose';
import UserModel from '@/models/user';
import bcrypt from 'bcryptjs';

// req, res, next are standard node js's objects
export default async function handler(req, res, next) {
  const apiHandlers = {
    POST: async () => {
      await connectToDB();

      const { name, email, username, password } = req.body;

      if (!name || !email || !password)
        return res.json({ msg: 'All fields are required', status: 400 });

      const user = await UserModel.findOne({ email });

      if (user?.email)
        return res.json({ msg: 'User/Email already exists', status: 400 });

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

      if (!savedUser)
        return res.json({ msg: 'Signup unsuccessful', status: 500 });

      return res.json({
        msg: 'Sign Up Successful',
        status: 200,
        data: savedUser,
      });
    },
  };

  return apiHandlers[req.method]();
}
