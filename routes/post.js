const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User= mongoose.model("User")

router.get('/allpost',requireLogin,(req,res)=>{
    //show all posts
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(error=>{
        console.log(error)
    })
})

router.get('/friends',requireLogin,(req,res)=>{
    //show all posts if posted by in following
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(error=>{
        console.log(error)
    })
})


router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
   })
   post.save().then(result=>{
      res.json({post:result})
   })
   .catch(error=>{
      console.log(error)
   })
})

//all posts from user
router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(error=>{
        console.log(error)
    })
})
//delete posts from user
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((error,post)=>{
         if(error || !post){
              return res.status(422).json({error:error})
         }
         if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(error=>{
                  console.log(error)
              })
         }
    })
})

//using put as it is an updating operation
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((error,result)=>{
          if(error){
              return res.status(422).json({error:error})
          }
          else{
              res.json(result)
          }
    })
})
//pull like
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((error,result)=>{
          if(error){
              return res.status(422).json({error:error})
          }
          else{
              res.json(result)
          }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((error,result)=>{
          if(error){
              return res.status(422).json({error:error})
          }
          else{
              res.json(result)
          }
    })
})
/*
//delete comment
router.delete('/deletecomment/:id/:comment_id',requireLogin,(req,res)=>{
  const comment = {_id:req.params.comment_id}
  Post.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { comments: comment }
    },{
      new: true
    }
  )
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
        if (error || !postComment) {
            return res.status(422).json({ error: error })
        }
        else{
            const result = postComment
            res.json(result)
        }
  })
  */


module.exports = router
