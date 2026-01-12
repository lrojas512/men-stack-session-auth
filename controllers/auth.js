const express= require('express')
const router= express.Router()
const User = require('../models/user.js')
const bcrypt =require('bcrypt')



router.get('/sign-up',(req,res)=>{
res.render('auth/sign-in.ejs')
})

router.get('/sign-out',(req,res)=>{
    req.session.destroy() 
    res.redirect('/')
})

router.post('/sign-in', async (req,res)=>{
     const userInDB = await User.findOne({ username: req.body.username})
    if(!userInDB){
        return res.send(`A user with username ${req.body.username} does not exist.`)
    }

const isValidPassword = bcrypt.compareSync(req.body.password,userInDB.password)
if(!isValidPassword){
    return res.send(`Password incorrect`)
}

req.session.user = {
    username: userInDB.username,
    _id: userInDB._id,
}

// req.session.save(()=>)

res.redirect('/')

})

router.post('/sign-up', async (req,res)=>{
    const userInDB = await User.findOne({ username: req.body.username})
    if(userInDB){
        return res.send(`A user with username ${req.body.username} already exists`)
    }
    if(req.body.password !== req.body.confirmPassword){
        return res.send(`Your password and password confrim must match!`)
    }


    const hashPassword =bcrypt.hashSync(req.body.password,10)

    req.body.password = hashPassword

    const newUser = await User.Create(req.body)

    res.send(newUser)


})
module.exports = router