import React,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import Powerslap from '../../assets/register.mp4'

 const Signup = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setURL] = useState(undefined)
    useEffect(()=>{
      if(url){
          uploadFields()
      }
    },[url])

    const uploadPic = ()=>{
      const data = new FormData()
      data.append("file",image)
      data.append("upload_preset","insta-clone")
      data.append("cloud_name","theram55")
      fetch("https://api.cloudinary.com/v1_1/theram55/image/upload",{
          method:"post",
          body:data
      })
      .then(res=>res.json())
      .then(data=>{
          setURL(data.url)
      })
      .catch(error=>{
          console.log(error)
      })
    }

    const uploadFields = ()=>{
            //email format verification
            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
              M.toast({html:"Invalid email...",classes:"#d32f2f red darken-2"})
              return
            }
            fetch("/signup",{
              method:"post",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({
                  name,
                  password,
                  email,
                  pic:url
              })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                   M.toast({html:data.error,classes:"#d32f2f red darken-2"})
                }
                else{
                   M.toast({html:data.message,classes:"#1de9b6 teal accent-3"})
                   history.push('/signin')
                }
            }).catch(error=>{
                console.log(error)
            })
          }

    const PostData = ()=>{
        if(image){
            uploadPic()
        }
        else{
            uploadFields()
        }
    }


    return(
      <div className="mycard">
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          width: "100%",
          left: "50%",
          top: "50%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          zIndex: "-1"
        }}
      >
        <source src={Powerslap} type="video/mp4"/>
      </video>
        <div className="card auth-card input-field">
            <h2>Instagram</h2>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <div className="file-field input-field">
              <div className="btn #64b5f6 blue lighten-2">
                <span>Upload Profile Pic</span>
                <input
                  type="file"
                  onChange={(e)=>setImage(e.target.files[0])}/>
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
              </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue lighten-2"
            onClick={()=>PostData()}
            >
              Sign Up
            </button>
            <h5>
              <Link to="/signin">Already have an account?</Link>
            </h5>
        </div>
      </div>
    )
 }

 export default Signup
