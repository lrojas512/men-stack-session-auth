const express = require('express')
const router = express.Router()
const User = require('../models/user')


router.get('/', async (req,res)=>{
    const allUsers = await User.find()
    res.json({allUsers})
})

router.get('/addPet', (req,res)=>{
    res.render('pets/new.ejs')
})

router.post('/addPet', async (req,res)=>{
    try{
    const userId = req.session.user._id
    const foundUser= await User.findById(userId)

    foundUser.pets.push(req.body)

    await foundUser.save()

        res.redirect ('/users')
    } catch(error){
        res.json({'error':error})
    }
})

router.get('/:userId', async (req,res)=>{
    const user = await User.findById(req.params.userId)
    if(user){
        res.render('users/profile.ejs', { user })
    } else{
        res.send(`Error finding user with userid: ${req.params.userId}`)
    }
})


module.exports = router