const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const io = require('socket.io')
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => { 
    res.send('onUsersRoute')
}) 
router.get('/hola', (req, res) => { 
    res.send('onUsersRouteHOLA')
}) 

router.post('/',
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
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(req.body.password,salt)
    console.log(req.body)
    const { email, password, name } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {  
        const errorMsg = errors.errors[0].msg
        return res.json({ ok: false, errors: {data:[errorMsg]}})
    } else { 
    const user = new User({
        email: email,
        password: hasedPassword,
        name: name
    }); 
    try { 
        const savePost = await user.save();
        return res.json({ ok: true, payload: { message: 'Registro Exitoso'} })
        
    }
    catch (err) { res.json({ data: err }) }
}
})

router.post('/login', [check('email').exists().withMessage('Falta agregar el correo'),
    check('password').exists().withMessage('Falta agregar contraseña')],
    async (req, res) => { 
        const { email, password } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMsg = errors.errors[0].msg
            return res.json({ ok: false, errors: { data: [errorMsg] } })
            //return res.status(200).json({ ok: false, errors: { assdw: [errorMsg]} })
        } else {
            console.log(email, password)
            const userData = await User.findOne({ email: req.body.email })
            console.log(2)
            console.log(userData)
            console.log(3)
            if (!userData) return res.json({ ok: false, error: { message: ['El correo no esta registrado'] } })
            
            const validPass = await bcrypt.compare(password, userData.password)
            if (!validPass) {
               return res.json({ ok: false, errors: { data: ['Contraseña incorrecta'] } })
            }
            else {
                const token = jwt.sign({ _id: userData.id }, process.env.SECRET_TOKEN);
                res.json({ userData, token: token })
                //res.header('auth-token', token).json({userData, token:token})
                //return res.status(200).json({ userData})
            }  
        }
    }
)

module.exports = router;