'use strict';
import mongoose, { Schema } from 'mongoose';

mongoose.connect(process.env.MONGOLAB_URI);

const creatorSchema = new Schema({
  name: String,
  role: String,
  email: String,
  state: {
    type: Number,
    default: 1
  }
});

const workSchema = new Schema({
  name: String,
  description: String,
  section: Number,
  thumbnail: String,
  creators: [creatorSchema],
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  }
});

export const Work = mongoose.model('Work', workSchema);
