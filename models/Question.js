const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Users', UserSchema)