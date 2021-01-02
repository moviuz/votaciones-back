const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const io =  require('socket.io')

router.get('/', (req, res) => { 
    res.send('onUsersRoute')
}) 
router.get('/hola', (req, res) => { 
    res.send('onUsersRouteHOLA')
}) 

router.post('/',
    //Encriptar contraseña
    [check('email').exists().withMessage('Falta agregar el correo').isEmail().withMessage('No es un correo valido').custom(async (email) => { 
        const existingUser =  await User.findOne({ email })       
        if (existingUser) { 
            throw new Error('El email ya esta registrado') 
        } 
    }),
    check('password').exists().withMessage('Falta agregar contraseña').isLength({ min: 8 }).withMessage('Minimo 8 caracteres en la contraseña'),
    check('name').exists().withMessage('falta agregar nombre').isString().withMessage('No es un formato valido')
    ],
    async (req, res) => { 
    console.log(req.body)
    const { email, password, name } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {  
        const errorMsg = errors.errors[0].msg
        return res.json({ ok: false, errors: {data:[errorMsg]}})
    } else { 
    const user = new User({
        email: email,
        password: password,
        name: name
    }); 
    try { 
        const savePost = await user.save();
        return res.json({savePost})
        
    }
    catch (err) { res.json({ message: err }) }
}
})

router.post('/login', [check('email').exists().withMessage('Falta agregar el correo'),
    check('password').exists().withMessage('Falta agregar contraseña')],
    async (req, res) => { 
        const { email, password } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) { 
            const errorMsg = errors.errors[0].msg
            return res.json({ ok: false, errors: {data:[errorMsg]}})
            //return res.status(200).json({ ok: false, errors: { assdw: [errorMsg]} })
        }
    }
)

module.exports = router;