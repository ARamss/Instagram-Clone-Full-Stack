const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello user")
})

router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body
    //if trying to submit an empty signup form
    if(!email || !password || !name){
        return res.status(422).json({error:"Something is missing..."})
    }
    //get user for db
    User.findOne({email:email})
      .then((savedUser)=>{
          if(savedUser){
            return res.status(422).json({error:"user already exists with that email"})
          }
          //hash password
          bcrypt.hash(password,12) //12 rounds
          .then(hashedpassword=>{
              const user = new User({
                  email,
                  password:hashedpassword,
                  name,
                  pic
              })
              user.save()
              .then(user=>{
                  res.json({message:"saved succesfully"})
              })
              .catch(error=>{
                  console.log(error)
              })

          })
    })
    .catch(error=>{
        console.log(error)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
          return res.status(422).json({error:"Invalid Email or password"})
        }
        //compare password from client and user in db
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"successfully signed in"})
                //creating token based on user id
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
              return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(error=>{
              console.log(error)
        })
    })
})

module.exports = router
