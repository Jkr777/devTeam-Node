const express = require('express'),
      auth = require('../middleware/auth'),
      { User } = require('../model/user'),
      router = express.Router();

router.get('/', auth, async(req, res) => {
  const user = await User.findById(req.user._id).select('_id name email avatar');
  if(!user) return res.status(401).send('Invalid Token');

  res.status(200).send(user);
});

module.exports = router;