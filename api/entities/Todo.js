const mongoose = require("mongoose");
const TodoSchema = new mongoose.Schema({
    parentId: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    isFinished: {
        type: Boolean,
        default: false,
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
    finishedAt: {
        type: Date,
        default: null,
    },
    createdBy: {
        type: String,
    },
    invited: {
        type: Array,
        default: [],
    },
    updatedBy: {
        type: String,
        default: null,
    },
    deletedBy: {
        type: String,
        default: null,
    },
    finishedBy: {
        type: String,
        default: null,
    },
});
TodoSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    return next();
});
TodoSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    delete object.password;
    return object;
});


module.exports = mongoose.model("Todo", TodoSchema);
