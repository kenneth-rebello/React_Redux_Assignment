const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const multer  = require('multer');
const path = require('path');


//Set up multer
const allowedFileTypes = /jpeg|jpg|png|jfif/;
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, callback) => {
        callback(null, 'profile_picture-'+Date.now()+path.extname(file.originalname));
    },
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);
        if(mimetype && extname){
            return callback(null, true);
        }
        else{
            return callback('Only images allowed');
        }
    },
    
}).single('profile_picture');

const auth = require("../../../middleware/auth");
const { 
    registerUser, 
    updateUser, 
    getUserById, 
    getAllUsers,
    sanitizeUser
} = require('../../../services/users');


//NEW USER REGISTRATION
router.post('/',
    upload,
    [
        check('name','Name is required').trim().not().isEmpty(),
        check('email', 'Enter a valid email id').isEmail(),
        check('phone', 'Enter a valid 10 digit phone number').optional().isLength({min:10, max:10}),
        check('password','Password must have 6 or more characters').isLength({min:6})
    ],
    async (req, res) => {

        //Get validation middleware result
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            return res.json({
                error: validationErrors.array(),
                success: false,
                statusCode: 400
            });
        }
        const newUser = req.body;

        if(req.file){
            newUser.profile_picture = req.file.filename;
        }

        const result = await registerUser(newUser);
        return res.json({
            ...result.response,
            statusCode: result.status
        })
})



//200 USER INFO
router.get("/", auth, async(req,res) =>{
    
    const user = await getUserById(req.user.id);
    if(!user){
        return res.json({
            error: [{ msg: "There was en error fetching your profile"}],
            success: false,
            statusCode: 404
        });
    }

    return res.json({
        data: sanitizeUser(user),
        success: true,
        statusCode: 200
    });
})


//GET ALL USERS
router.get('/all', auth, async (req, res) => {
    
    const result = await getAllUsers();

    return res.json({
        ...result.response,
        statusCode: 200
    })
});


//UPDATE USER DETAILS
router.post('/update', 
    auth, 
    upload, 
    [
        check('name','Name is required').optional().trim().notEmpty(),
        check('email', 'Enter a valid email id').optional().isEmail(),
        check('phone', 'Enter a valid 10 digit phone number').optional().isLength({min:10, max:10}),
        check('password','Password should not be changed using /update').isEmpty()
    ],
    async(req, res) => {

        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            return res.json({
                error: validationErrors.array(),
                success: false,
                statusCode: 400
            });
        }
        const newData = req.body;
        const currentUser = await getUserById(req.user.id);

        if(req.file){
            newData.profile_picture = req.file.filename;
        }

        const updatedUser = {
            "id": currentUser.id,
            "name": newData.name || currentUser.name,
            "email": newData.email || currentUser.email,
            "phone": newData.phone || currentUser.phone,
            "profile_picture": newData.profile_picture || currentUser.profile_picture,
            "password": currentUser.password
        }

        if(await updateUser(updatedUser)){
            return res.json({ 
                data: {
                    msg:`User ${updatedUser.name} updated`,
                    new: sanitizeUser(updatedUser)
                },
                success: true,
                statusCode: 400
            })
        }else{
            return res.json({ 
                error: [{msg: "There was an issue updating the user"}],
                success: false,
                statusCode: 500
            })
        }
})

module.exports = router;