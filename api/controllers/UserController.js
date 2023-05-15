const User = require("../entities/User");

const getUsers = async (req, res) => {
    return User.find({}, {password:0}).then((list) => res.send(list))
        .catch((err) => res.sendStatus(500));
};
const getUser = async (req, res) => {
    const id = req.params.userId === 'me' ? req.body.userId : req.params.userId;
    return User.findById(id).select("-password")
        .then((user) => res.send(user))
        .catch((err) => res.sendStatus(500));
};

const createUser = (req, res) => {
    return User.create(req.body).then((user) => {
        const {password, ...data} =  user._doc;
        res.send(data);
    })
        .catch((err) => res.sendStatus(500));
};
const editUser = (req, res) => {
    return User.findOneAndUpdate(
        {_id: req.params.userId},
        {
            $set: req.body,
        }, {new: true}).then(() => res.json({message: "User Updated"}))
        .catch((err) => res.sendStatus(500));
};
const removeUser = (req, res) => {
    return User.findOneAndUpdate(
        {_id: req.params.userId},
        {
            $set: req.body,
        },
        {new: true}).then(() => res.json({message: "User Updated"}))
        .catch((err) => res.sendStatus(500));
};
module.exports = {
    createUser,
    editUser,
    removeUser,
    getUser,
    getUsers,
}
