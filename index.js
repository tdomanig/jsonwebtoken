
import { initializeApp } from "firebase/app";
const { initializeApp}=require("firebase/app") 

const firebaseConfig = {
  apiKey: "AIzaSyB4Fq5XmjVIK5jJ5VVDs3RqBePLmLcSeeg",
  authDomain: "coding-school-312d2.firebaseapp.com",
  projectId: "coding-school-312d2",
  storageBucket: "coding-school-312d2.appspot.com",
  messagingSenderId: "813771540933",
  appId: "1:813771540933:web:a0709a6895a42b0346a3ac"
};


const firebaseApp = initializeApp(firebaseConfig);


const express= require('express')
const app=express()
const jwt= require('jsonwebtoken')
const jwktopem=require('jwk-to-pem')
app.use(express.json())

const profiles=[
{email: 'erdepfl@bar.com', password:"123", name: 'Erdepfl',role: 'admin'},
{email: 'suppm@bar.com', password:"234", name: 'Suppm' ,role: 'user'},
{email: 'pflegecreme@bar.com', password:"345", name: 'Pflegecreme',role: 'admin'},
{email: 'Suppenwürfel@bar.com', password:"456", name: 'Suppenwürfel',role: 'user'},
{email: 'harder@bar.com', password:"789", name: 'Harder',role: 'user'},
{email: 'mahlzeit@bar.com', password:"5932", name: 'Mahlzeit',role: 'user'}]

const verifytoken=(request,response,next) => {

    const authHeader=request.headers.authorization
    
    

    const accestoken=authHeader.slice('Bearer '.length)
    
    

    jwt.verify(accestoken, jwktopem({
        "kty": "EC",
        "use": "sig",
        "crv": "P-521",
        "kid": "my-key",
        "x": "AFoh4YvVoAqsvjUp-G9LlR6byg2c6gfsvzzxVVsIVyfMti7juo6ysy1SI4w-x8fD0-P4D7M8LeQ5IxvdIAa5tv2X",
        "y": "AfYB0IPs2pT7DuOY22Ql6pmKXMe4hlRbYGziaOIodrravamdFhi5y3xb6Ta4gri_f17nBbozPQ-EG7OrE9Xqe7F7",
        "alg": "ES512"
    }),(error,payload) => {
        
        if(error) return response.sendStatus(401)

        request.user={email:payload.email}
        request.admin={role:payload.role}
        
        next()
    })
}

const isAdmin=(request,response,next) => {
    
    if(request.admin.role==="admin"){
        admin=true
    }else{admin=false}
    next()
}

app.get('/profile',verifytoken,(request, response)=>{

  

    response.json(request.email)
})

app.post('/authenticate',(request, response)=>{

    const{ email }=request.body
    const { password }=request.body
   
    

    const profile= profiles.find((p)=>p.email===email&&p.password===password)
    const role =profile.role

    console.log(role)
    console.log(profile)

    

   
    if(profile==null) return response.sendStatus(400)
   
    const accestoken= jwt.sign({email,password,role},jwktopem({
        "kty": "EC",
        "d": "ANAWfLEI1tHGnRE3uMEyHQEtzq1yTPgpSB6m_K95RhyQV9hvBmpjJRweraOmtuCLeASjLeyStth9VpjMGqUIh5Ef",
        "use": "sig",
        "crv": "P-521",
        "kid": "my-key",
        "x": "AFoh4YvVoAqsvjUp-G9LlR6byg2c6gfsvzzxVVsIVyfMti7juo6ysy1SI4w-x8fD0-P4D7M8LeQ5IxvdIAa5tv2X",
        "y": "AfYB0IPs2pT7DuOY22Ql6pmKXMe4hlRbYGziaOIodrravamdFhi5y3xb6Ta4gri_f17nBbozPQ-EG7OrE9Xqe7F7",
        "alg": "ES512"
    },{private:true}),{algorithm:"ES512"})
    response.json({accestoken})
})

app.get('/admin',verifytoken,isAdmin,(request,response)=>{
if(admin===true){
    response.json(profiles)
    console.log('geht')
}else{
    console.log('gehtnit')
    response.sendStatus(403)
}
   
    
   
  
})

app.listen(2000,()=>{console.log('running on port 2000')})