const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    emailConfirmation: {
        type: String,
        default: null
    },
});
// hash user password before saving into database
UserSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, saltRounds);
    this.updatedAt = Date.now();
    next();
});
module.exports = mongoose.model('User', UserSchema);
