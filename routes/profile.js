const express = require('express'),
      auth = require('../middleware/auth'),
      { Profile, joiValidation, joiExperience, joiProfileUpdate } = require('../model/profile'),
      _ = require('lodash'),
      { User } = require('../model/user'),
      { Post } = require('../model/post'),
      ITEMS_PER_PAGE = 5,
      router = express.Router();

router.post('/', auth, async(req, res) => {
  const { error } = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let profile = await Profile.findOne({ userId: req.user._id });
  if(profile) return res.status(400).send('You already have a profile');

  profile = new Profile({
    userId: req.user._id,
    website: req.body.website,
    location: req.body.location,
    status: req.body.status,
    skills: req.body.skills,
    bio: req.body.bio,
    gitHub: req.body.gitHub,
    social: req.body.social
  });
  await profile.save();
  
  res.status(201).send(profile);
});

router.get('/', auth, async(req, res) => {
  const profile = await Profile.findOne({userId: req.user._id}).sort({'experience.current': 1});
  if(!profile) return res.status(400).send('You need to create a profile');

  res.status(200).send(profile);
});

router.patch('/edit', auth, async(req, res) => {
  const { error } = joiProfileUpdate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let profile = await Profile.findOne({ userId: req.user._id });
  if(!profile) return res.status(404).send('Profile not found');

  let updates = _.pick(req.body, ["company", "website", "location", "status", "skills", "bio", "githubusername", "social"]);

  profile.set(updates);
  await profile.save();

  res.status(200).send(profile);
});

router.get('/more', auth, async(req, res) => {
  const page = Number(req.query.page);
  const profiles = await Profile.find()
        .populate('userId', {_id: 1, name: 1, avatar: 1})
        .select({_id: 1, userId: 1, skills: 1, date: 1, location: 1, status: 1})
        .sort({date: -1})
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);

  if(profiles.length === 0) return res.status(400).send('No profiles');

  res.status(200).send(profiles);
});

router.get('/:id', auth, async(req, res) => {
  const profile = await Profile.findById(req.params.id)
        .populate('userId', {name: 1, avatar: 1})
        .select({userId: 1, skills: 1, date: 1, location: 1, status: 1, gitHub: 1, bio: 1, social: 1, experience: 1});

  if(!profile) return res.status(404).send('Profile not found');

  res.status(200).send(profile);
});

router.delete('/', auth, async(req, res) => {
  const profile = await Profile.deleteOne({ userId: req.user._id });
  if(!profile) return res.status(404).send('Profile not found');

  const user = await User.deleteOne({ _id: req.user._id });
  if(!user) return res.status(404).send('User not found');

  await Post.deleteOne({ userId: req.user._id })

  res.status(201).send('Removed');
});

router.put('/experience', auth, async(req, res) => {
  const { error } = joiExperience(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let pofile;
  if(req.body.current) {
    profile = await Profile.findOneAndUpdate({userId: req.user._id}, 
      {$push: {
        experience: {
          $each: [req.body],
          $position: 0
        }
      }}, {new: true});
  } else {
    profile = await Profile.findOneAndUpdate({userId: req.user._id}, 
      {$push: {
        experience: req.body
      }}, {new: true});
  }
  if(!profile) return res.status(404).send('Profile not found');
  
  res.status(200).send(profile);
});

router.delete('/experience/:id', auth, async(req, res) => {
  const profile = await Profile.findOneAndUpdate({ userId: req.user._id }, 
    {$pull: {
      experience: {_id: req.params.id}  
    }}, {new: true});
  if(!profile) return res.status(404).send('Profile not found');

  res.status(200).send(profile);
});

module.exports = router;