const express = require('express'),
      cors = require('cors'),
      corsOptions = {
        exposedHeaders: 'X-Auth',
      },
      login = require('../routes/login'),
      auth = require('../routes/auth'),
      profile = require('../routes/profile'),
      register = require('../routes/register'),
      posts = require('../routes/posts'),
      errorHandler = require('../middleware/error');

module.exports = app => {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use('/register', register);
  app.use('/login', login);
  app.use('/auth', auth);
  app.use('/profile', profile);
  app.use('/posts', posts);
  app.use('*', function(req, res) {
    res.status(404).send("Page Not Found");
  });
  app.use(errorHandler);
};