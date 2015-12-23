'use strict';
import mongoose, { Schema } from 'mongoose';

mongoose.connect(process.env.MONGOLAB_URI);

const workSchema = new Schema({
  section: Number,
  name: String,
  description: String,
  thumbnail: String,
  creators: [{
    name: String,
    role: String,
    email: String,
    state: {
      type: Number,
      default: 1
    }
  }],
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
