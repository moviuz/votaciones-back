const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answerOne: {
        type: String,
        required: true
    },
    answerTwo: {
        type: String,
        require: true
    },
    answerTree: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Questions', QuestionSchema)