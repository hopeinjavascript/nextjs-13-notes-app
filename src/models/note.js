import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;

const NoteSchema = mongoose.Schema(
  {
    title: {
      type: 'string',
      required: [true, 'title is required'],
      minLength: 5,
    },
    desc: {
      type: 'string',
      required: [true, 'desc is required'],
      minLength: 20,
    },
    status: { type: 'string', required: [true, 'status is required'] },
    createdBy: {
      type: ObjectId,
      required: [true, 'createdBy is required'],
      ref: 'user',
    },
  },
  { timestamps: true }
);

// model name is converted to plural and lowercase on creation
// create model only if there is no model with the same name
const NoteModel = mongoose.models.note || mongoose.model('note', NoteSchema);

export default NoteModel;
