const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
})

UserSchema.methods.toJSON = function () { 
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject
}

module.exports = mongoose.model('Users', UserSchema)