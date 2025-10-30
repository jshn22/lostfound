const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['lost', 'found'], required: true },
  category: { type: String },
  location: { type: String, required: true },
  imageUrl: { type: String },
  cloudinaryPublicId: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
