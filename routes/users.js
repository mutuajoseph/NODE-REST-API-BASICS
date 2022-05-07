const express = require("express")
const User = require('../models/User')

const router = express.Router()

// GET ALL USERS 
router.get('/', async (req, res) => {
    
    try {
        const allUsers = await User.find()
        res.json(allUsers)
    } catch (err) {
        res.json({message: err})
    }
})

// GET A SINGLE USER
router.get('/:userId', async (req, res) => {
    try {
        const singleUser = await User.findById(req.params.userId)
        res.json(singleUser)
    } catch (err) {
        res.json({message: err})
    }
})

// CREATE NEW USER 
router.post('/', async (req, res) => {
    try {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })

        const newUser = await user.save()

        res.json(newUser)

    } catch (err) {
        res.json({message: err})
    }
})

// EDIT USER
router.put('/:userId', async (req, res) => {
    try {
        
        const updatedUser = await User.updateOne(
            {_id: req.params.userId},
            { 
                firstName: req.body.firstName, 
                lastName: req.body.lastName,
                email:req.body.email
            }
        )

        res.json({
            message: "User updated successfully",
            data: updatedUser
        })

    } catch (err) {
        res.json({message: err})
    }
})

// DELETE USER
router.delete('/:userId', async (req, res) => {
    
    try {

        const deletedUser = await User.deleteOne({_id: req.params.userId})
        res.json({
            message: "User deleted successfully",
            data: deletedUser
        })
        
    } catch (err) {
        res.json({message: err})
    }
})

module.exports = router