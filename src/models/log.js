import mongoose from 'mongoose';

// schema less - set { strict: false }
const LogSchema = mongoose.Schema({}, { timestamps: true, strict: false });

// model name is converted to plural and lowercase on creation
// create model only if there is no model with the same name
const LogModel = mongoose.models.log || mongoose.model('log', LogSchema);

export default LogModel;
