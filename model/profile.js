const mongoose = require('mongoose'),
      Joi = require('@hapi/joi')
      .extend(require('@hapi/joi-date'));

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  website: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    lowercase: true
  },
  location: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    lowercase: true,
    required: true
  },
  status: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    lowercase: true,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String,
    minlength: 50,
    maxlength: 400,
    trim: true,
    required: true
  },
  gitHub: {
    type: String,
    maxlength: 255,
    trim: true
  },
  experience: [
    {
      title: {
        type: String,
        minlength: 3,
        maxlength: 255,
        trim: true,
        lowercase: true,
        required: true
      },
      company: {
        type: String,
        minlength: 3,
        maxlength: 255,
        trim: true,
        lowercase: true,
        required: true
      },
      from: {
        type: Date
      },
      location: {
        type: String,
        minlength: 3,
        maxlength: 255,
        trim: true,
        lowercase: true,
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      }
    }
  ],
  social: {
    youtube: {
      type: String,
      trim: true,
      maxlength: 255
    },
    twitter: {
      type: String,
      trim: true,
      maxlength: 255
    },
    facebook: {
      type: String,
      trim: true,
      maxlength: 255
    },
    instagram: {
      type: String,
      trim: true,
      maxlength: 255
    }
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const Profile = mongoose.model("Profile", profileSchema);

function joiValidation(data) {
  const schema = {
    website: Joi.string().min(3).max(255).trim(),
    location: Joi.string().min(3).max(255).trim().required(),
    status: Joi.string().min(3).max(255).trim().required(),
    skills: Joi.array().items(Joi.string().max(255).trim()).required(),
    bio: Joi.string().min(50).max(400).trim().required(),
    gitHub: Joi.string().min(3).max(255).trim(),
    social: Joi.object().keys({
      youtube: Joi.string().max(255).trim(),
      twitter: Joi.string().max(255).trim(),
      facebook: Joi.string().max(255).trim(),
      instagram: Joi.string().max(255).trim()
    })
  };
  return Joi.validate(data, schema);
};

function joiProfileUpdate(data) {
  const schema = {
    website: Joi.string().min(3).max(255).trim(),
    location: Joi.string().min(3).max(255).trim(),
    status: Joi.string().min(3).max(255).trim(),
    skills: Joi.array().items(Joi.string().max(255).trim()),
    bio: Joi.string().min(50).max(400).trim(),
    gitHub: Joi.string().min(3).max(255),
    social: Joi.object().keys({
      youtube: Joi.string().max(255),
      twitter: Joi.string().max(255),
      facebook: Joi.string().max(255),
      instagram: Joi.string().max(255)
    })
  };
  return Joi.validate(data, schema);
};

function joiExperience(data) { 
  const schema = {
    title: Joi.string().min(3).max(255).trim().required(),
    company: Joi.string().min(3).max(255).trim().required(),
    location: Joi.string().min(3).max(255).trim(),
    from: Joi.date().format('YYYY-MM-DD'),
    to: Joi.date().format('YYYY-MM-DD'),
    current: Joi.boolean()
  }
  return Joi.validate(data, schema)
};

module.exports = { Profile, joiValidation, joiExperience, joiProfileUpdate };