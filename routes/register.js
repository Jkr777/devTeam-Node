const express = require('express'),
      { User, joiValidation } = require('../model/user'),
      gravatar = require('gravatar'),
      _ = require('lodash'),
      router = express.Router();

router.post('/', async(req, res) => {
  const { error } = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send("Invalid email or password");
  let avatar = gravatar.url(req.body.email, {
    s: "200",
    r: "pg",
    d: "mm"
  });

  user = new User(_.pick(req.body, ["name", "email", "password", "avatar"]));
  user.avatar = avatar;
  await user.save();
  const token = user.setToken();

  res.status(201).header("x-auth", token).send(_.pick(user, ["_id", "name", "email", "avatar"]));
});

module.exports = router;