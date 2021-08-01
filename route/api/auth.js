const express = require('express');
var router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/Users')
const { check , ValidationResult, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')

router.get('/', auth,
async (req , res) => 
{
    try
    {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    }catch(err)
    {
        console.error(err.message);
        res.status(500).send('server error');
    }
}) ;

router.post('/',
[
    check('email' , 'Email should be valid').isEmail(),
    check('password' , 'password is required').exists()

],
async (req , res) => 
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }

    const { name , email , password } = req.body;

    try
    {
        let user = await User.findOne({email})

        if(!user)
        {
            res.status(400).json({errors : [{ msg : 'Invalid credentiels '}]})
        }
        
        const isMatch = await bcrypt.compare(password , user.password)
       
        if(!isMatch)
        {
            res.status(400).json({errors : [{ msg : 'Invalid credentiels '}]})
        }

        const payload =
        {
            user: 
            {
                id: user.id
            }
        }

        jwt.sign(payload , config.get('jwtsecret'), {expiresIn: 360000000 } , 
        (err , token)=>
        {
            if(err) throw err;
            res.json({token})
        })

    }catch(err)
    {
        console.error(err.message)
        res.status(500).send('Server issue')
    }
});

module.exports = router;
