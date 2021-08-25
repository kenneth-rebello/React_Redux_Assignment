const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const auth = require('../../../middleware/auth');
const { getUserByEmail, getUserById, updateUser } = require("../../../services/users");
const { getPasswordHash ,matchPassword } = require('../../../services/auth');


//LOGIN ROUTE
router.post("/", 
    [
        check('email', 'Valid email required').isEmail(),
        check('password','Password required').trim().not().isEmpty(),
    ],
    async(req, res) =>{
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            return res.json({
                error: validationErrors.array(),
                success: false
            });
        }

        const userCredentials = req.body;

        //Fetch user from data store
        const user = await getUserByEmail(userCredentials.email);
        if(!user){
            return res.json({
                error:[{ msg: "Invalid credentials email"}],
                success: false
            });
        }

        //Check password
        const isMatch = await matchPassword(userCredentials.password || "", user.password || "");
        if(!isMatch){
            return res.json({
                error: [{ msg: 'Invalid credentials pass'}],
                success: false
            });
        }

        //Generate JSON Web Token
        const payload = {
            user: {
                email: user.email,
                name: user.name,
                id: user.id
            }
        };
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000},(err, token) => {
            if(err){
                console.log(err)
            };
            res.json({
                data:{
                    token: token
                },
                success: true
            });
        })
    }
)

router.post('/change-password',
    [
        check('old_password','Old password required').trim().not().isEmpty(),
        check('new_password','New password required').trim().not().isEmpty(),
    ], 
    auth, 
    async(req, res) => {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            return res.json({
                error: validationErrors.array(),
                success: false
            });
        }

        const data = req.body;
        let user = await getUserById(req.user.id);

        //Check password
        const isMatch = await matchPassword(data.old_password, user.password);
        if(!isMatch){
            return res.json({
                error: [{ msg: 'Invalid credentials'}],
                success: false
            });
        }

        //Hash password
        user.password = await getPasswordHash(data.new_password);

        //Update in data store
        if(updateUser(user)){
            return res.json({ 
                data:{
                    msg:`Password for ${user.name} updated`
                },
                success: false
            })
        }else{
            return res.json({ 
                error: [{msg: "There was an issue changing the password"}],
                success: false
            })
        }

    }
)

module.exports = router;