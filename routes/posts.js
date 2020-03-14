const express = require('express'),
      auth = require('../middleware/auth'),
      { Post, joiPost } = require('../model/post'),
      { User } = require('../model/user'),
      ITEMS_PER_PAGE = 5,
      router = express.Router();

router.post('/', auth, async(req, res) => {
  const { error } = joiPost(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if(!user) return res.status(404).send('User not found');

  let post = new Post({
    userId: req.user._id,
    title: req.body.title,
    text: req.body.text,
    avatar: user.avatar
  });
  await post.save();
  post = await post.populate('userId', {name: 1, avatar: 1}).execPopulate();

  res.status(201).send(post);
});

router.get('/', auth, async(req, res) => {
  const page = Number(req.query.page);
  const posts = await Post.find()
        .populate('userId', {name: 1, avatar: 1})
        .sort({date: -1})
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
        
  if(posts.length === 0) return res.status(404).send('No Posts');

  res.status(200).send(posts);
});

router.get('/myPosts' , auth, async(req, res) => {
  const posts = await Post.find({userId: req.user._id})
        .populate('userId', {name: 1, avatar: 1})
        .sort({date: -1});     
  if(posts.length === 0) return res.status(404).send('No Posts');

  res.status(200).send(posts);
});

router.get('/:id', auth, async(req, res) => {
  const post = await Post.findById(req.params.id)
        .populate('userId', {name: 1, avatar: 1});
  if(!post) return res.status(404).send('Post not found');

  res.status(200).send(post);
});

router.delete('/:id', auth, async(req, res) => {
  const post = await Post.deleteOne({_id: req.params.id});
  if(!post) return res.status(404).send('Post not found');

  res.status(200).send('removed');
});

router.put('/like/:id', auth, async(req, res) => {
  const post = await Post.findById(req.params.id);
  const liked = post.likes.some(e => e.userId == req.user._id);

  if(liked) return res.status(400).send('Post already liked');
  post.likes.push({userId: req.user._id});
  await post.save();

  res.status(201).send('liked');
});

router.put('/unlike/:id', auth, async(req, res) => {
  const user = await User.findById(req.user._id);
  if(!user) return res.status(401).send('You need to log');

  const post = await Post.findOneAndUpdate({_id: req.params.id},
    {$pull: {
      likes: {
        userId: req.user._id
      }
    }}, {new: true})
  if(!post) return res.status(404).send('Post not found');

  res.status(200).send(post);
});

router.post('/comment/:id', auth, async(req, res) => {
  const { error } = joiPost(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if(!user) return res.status(404).send('User not found');

  let newComment = {
    userId: req.user._id,
    title: req.body.title,
    text: req.body.text,
    name: user.name,
    avatar: user.avatar
  };

  const post = await Post.findOneAndUpdate(
    { _id: req.params.id },
    { $push: {comments: {$each: [newComment], $position: 0}}
    }, {new: true}
  );
  if(!post) return res.status(404).send('Post not found');

  res.status(201).send(post.comments[0]);
});

router.delete('/comment/:id/:comment_id', auth, async(req, res) => {
  const user = await User.findById(req.user._id);
  if(!user) return res.status(401).send('You need to log');

  const post = await Post.findOneAndUpdate({_id: req.params.id}, 
    {$pull: {
      comments: {
        _id: req.params.comment_id
      }
    }}, {new: true});
  if(!post) return res.status(404).send('Post not found');

  res.status(200).send(post);
});

module.exports = router;