const express = require('express');
const router = express.Router(); 
const { check, validationResult } = require('express-validator')
const verify = require('./verifyToken')

router.get('/', verify , (req, res) => { 
    res.json() 
})

router.post('/create_survey',
    [check('question').exists().withMessage('No se agrego la pregunta').isString().withMessage('Lo que mandes debe de ser una cadena de catacteres'),
    [check('answerOne').exists().withMessage('No se agrego la respuesta #1').isString().withMessage('Lo que mandes debe de ser una cadena de catacteres'),
    [check('answerTwo').exists().withMessage('No se agrego la respuesta #2').isString().withMessage('Lo que mandes debe de ser una cadena de catacteres'),
    [check('anwerTree').exists().withMessage('No se agrego la respuesta #3').isString().withMessage('Lo que mandes debe de ser una cadena de catacteres')]    
    ]
  ]],
    async (req, res) => { 
        const { question, answerOne, answerTwo, anwerTree } = req.body;
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const erroMesg = errors.errors[0].msg
            return res.json({ ok: false, error: { data: [errorMsg] } })
        } else {
            console.log('YA DEBES GUARDAR EN LA BG')
         }
    }
)


module.exports = router;