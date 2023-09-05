import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    name: {
      type: 'string',
      required: [true, 'name is required'],
    },
    username: {
      type: 'string',
      required: [true, 'username is required'],
    },
    email: {
      type: 'string',
      required: [true, 'email is required'],
      unique: true,
    },
    password: {
      type: 'string',
      required: [true, 'password is required'],
      minLength: 8,
    },
  },
  { timestamps: true }
);

// model name is converted to plural and lowercase on creation
// create model only if there is no model with the same name
const UserModel = mongoose.models.user || mongoose.model('user', UserSchema);

export default UserModel;
