const express= require('express')
const app=express()
const jwt= require('jsonwebtoken')

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
    
    jwt.verify(accestoken, 'my-secret',(error,payload) => {
        
        if(error) return response.sendStatus(401)

        request.user={email:payload.email}
        
        
        next()
    })
}

const isAdmin=(request,response,next) => {
    const profile=profiles.find(({email})=>email===request.user.email)
    console.log(profile)
    request.admin=false
    if(profile.role==="admin"){
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
    
    console.log(email)

    const profile= profiles.find((p)=>p.email===email&&p.password===password)

    console.log(profile)

    if(profile==null) return response.sendStatus(400)
   
    const accestoken= jwt.sign({email,password},'my-secret')
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