const jwt = require('jsonwebtoken')
const{JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next) => {
    const{authorization} = req.headers
    //authorization === Bearer "token"
    if(!authorization){
        res.status(401).json({error:"You need to be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(error,payload)=>{
      if(error){
          res.status(401).json({error:"you must be logged in"})
      }
      const {_id} = payload
      //find user in DB with _id and then assign request.
      User.findById(_id).then(userdata=>{
          req.user = userdata
          next()
      })
    })
}
