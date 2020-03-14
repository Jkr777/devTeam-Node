const express = require('express'),
      { User } = require('../model/user'),
      _ = require('lodash'),
      Joi = require('@hapi/joi'),
      router = express.Router();

router.post('/', async(req, res) => {
  const { error } = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(!user) return res.status(401).send("Invalid email or password");

  const pass = await user.passCheck(req.body.password);
  if(!pass) return res.status(401).send("Invalid email or password");
  const token = user.setToken();

  res.status(200).header("x-auth", token).send(_.pick(user, ["_id", "name", "email", "avatar"]));
});

function joiValidation(data) {
  const schema = {
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
  return Joi.validate(data, schema, {abortEarly: false});
};

module.exports = router;