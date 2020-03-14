const mongoose = require('mongoose'),
      Joi = require('@hapi/joi');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: {
    type: String,
    minlength: 2,
    maxlength: 500,
    trim: true,
    required: true
  },
  title: {
    type: String,
    minlength: 2,
    maxlength: 50,
    trim: true,
    required: true
  },
  avatar: {
    type: String,
    maxlength: 500
  },
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
      },
      text: {
        type: String,
        minlength: 2,
        maxlength: 500,
        trim: true,
        required: true
      },
      title: {
        type: String,
        minlength: 2,
        maxlength: 50,
        trim: true,
        required: true
      },
      name: {
        type: String,
        minlength: 3,
        maxlength: 255
      },
      avatar: {
        type: String,
        maxlength: 500
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  }
});

const Post = mongoose.model('Post', postSchema);

function joiPost(data) {
  const schema = {
    text: Joi.string().min(2).max(500).required(),
    title: Joi.string().min(2).max(50).required()
  }
  return Joi.validate(data, schema)
};

module.exports = { Post, joiPost };