const mongoose = require('mongoose'),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt'),
      Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    lowercase: true,
    required: true
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 5,  
    maxlength: 255,
    trim: true,
    required: true
  },
  avatar: {
    type: String,
    maxlength: 500,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.setToken = function() {
  const token = jwt.sign({_id: this._id}, process.env.JWT_TOKEN, {expiresIn: '15h'});
  return token;
};

userSchema.methods.passCheck = async function(pass) {
  const check = await bcrypt.compare(pass, this.password);
  return check;
};

const User = mongoose.model('User', userSchema);

function joiValidation(data) {
  const schema = {
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email({minDomainSegments: 2}).min(5).max(255).required(),
    password: Joi.string()
    .min(5)
    .max(255)
    .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])"))
    .required()
    .error((errors) => {
      return errors.map(e => {
        console.log(e);
      switch(e.type) {
        case "string.min":
          return {message: "password must be of minimum 6 characters length"};
        case "string.max":
          return {message: "password must be of maximum 255 characters length"};
        case "string.regex.base":
          return {message: "the password must contain: At least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character and 1 special character."}
        case "any.required":
          return {message: `"password" is required`}
      }
    })
    })
  };
  return Joi.validate(data, schema, {abortEarly: false})
};

module.exports = { User, joiValidation };