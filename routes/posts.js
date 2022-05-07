const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// GET ALL POSTS
router.get("/", async (req, res) => {
    
    try {
        const allPosts = await Post.find()
        res.json(allPosts)
    } catch (err) {
        res.json({message: err})
    }
  
});

// GET A SINGLE POST
router.get("/:postId", async (req, res) => {

    try {
        const singlePost = await Post.findById(req.params.postId)
        res.json(singlePost)
    } catch (err) {
        res.json({message: err})
    }
})

// CREATE NEW POST
router.post("/", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    // date: Date.now
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

// EDIT POST
router.put('/:postId', async (req, res) => {
    
    try {
        const updatePost = await Post.updateOne(
            {_id: req.params.postId}, 
            {$set: {title: req.body.title, description: req.body.description}
        })

        res.json({
            message: "Post updated successfully!",
            data: updatePost
        })
    } catch (err) {
        res.json({message: err})
    }
})


// DELETE POST 
router.delete('/:postId', async (req, res) => {

    try {
        const deletedPost = await Post.deleteOne({_id: req.params.postId})

        res.json({
            message: "Post deleted successfully!",
            data: deletedPost
        })
    } catch (err) {
        res.json({message: err})
    }
})

module.exports = router;
