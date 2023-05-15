const Todo = require("../entities/Todo");
const User = require("../entities/User");
const {transport} = require("../utilities");

const searchTodos = async (req, res) => {
    return Todo.find({createdBy: req.body.userId}).then((list) => res.send({
        status: 'success',
        message: 'Todo Retrieved',
        data: list
    }))
        .catch((err) => res.sendStatus(500).send({status: 'error', message: err}));
};
const getAll = async (req, res) => {
    let sort = null;
    let search = req.query.search !== 'null' ? req.query.search : null;
    let find = null;
    let parent = null;
    if (req.query.sort) {
        switch (parseInt(req.query.sort)) {
            case 11:
                sort = {createdAt: 1}
                break;
            case 20:
                sort = {title: -1}
                break;
            case 21:
                sort = {title: 1}
                break;
            default:
                sort = {createdAt: -1};
                break;
        }
    }
    // console.log({sort: req.query.sort, order: sort, search, todoId: req.query.todo})
    if (search) {
        find = {
            $and: [
                {$or: [{createdBy: req.body.userId}, {invited: req.body.userId}], deletedAt: null},
                {title: {$regex: new RegExp(search, 'i')}}
            ]
        };
        if (req.query.todo !== 'undefined') {
            find.$and[0].parentId = req.query.todo;
        } else {
            find.$and[0].parentId = null;
        }
    } else {
        find = {$or: [{createdBy: req.body.userId}, {invited: req.body.userId}], deletedAt: null};
        if (req.query.todo !== 'undefined') {
            find.parentId = req.query.todo;
        } else {
            find.parentId = null;
        }
    }
    if (req.query.todo !== 'undefined') {
        find.parentId = req.query.todo;
        try {
            parent = await Todo.find({
                $or: [{createdBy: req.body.userId}, {invited: req.body.userId}],
                deletedAt: null,
                _id: req.query.todo
            });
        } catch (e) {
            console.log(e)
        }
    }
    return Todo.find(find)
        .sort(sort)
        .then((list) => res.send({
            status: 'success',
            message: 'Todo Retrieved',
            parent: parent ? parent[0] : null,
            data: list
        }))
        .catch((err) => {
            console.log(err)
            res.send({status: 'error', message: err})
        });
};
const getTodo = async (req, res) => {
    return Todo.findOne({
        _id: req.params.todoId,
        createdBy: req.body.userId
    }).then(async (model) => {
        const invited = await User.find({_id: model.invited}).select(['name', '_id', 'email']);
        res.send({
            status: 'success',
            message: 'Todo Retrieved',
            data: model,
            invited: invited ?? [],
        })
    }).catch((err) => res.sendStatus(500).send({status: 'error', message: err}));
};
const createTodo = async (req, res) => {
    const todo = new Todo(req.body);
    todo.createdBy = req.body.userId;
    return Todo.create(todo).then((model) => res.send({status: 'success', message: 'Todo Created'}))
        .catch((err) => res.sendStatus(500).send({status: 'error', message: err}));
};
const editTodo = (req, res) => {
    let data = req.body;
    data.updatedBy = req.body.userId;
    return Todo.findOneAndUpdate(
        {_id: req.params.todoId, createdBy: req.body.userId},
        {
            $set: data,
        },
        {new: false}).then(() => res.json({status: 'success', message: "Todo Updated"}))
        .catch((err) => res.sendStatus(500).send({status: 'error', message: err}));
};
const toggleTodo = (req, res) => {
    let message = null;
    return Todo.findOne({_id: req.body.id, $or: [{createdBy: req.body.userId}, {invited: req.body.userId}]}).then(todo => {
        let data = req.body;
        data.isFinished = !todo.isFinished;
        data.updatedBy = req.body.userId;
        message = data.isFinished ? "Todo marked as done" : "Todo marked as not done";
        if (data.isFinished) {
            data.finishedBy = req.body.userId;
            data.finishedAt = Date.now();
        }
        return Todo.findOneAndUpdate(
            {_id: req.body.id, $or: [{createdBy: req.body.userId}, {invited: req.body.userId}]},
            {
                $set: data,
            }).then(() => res.json({status: 'success', message}))
            .catch((err) => res.sendStatus(500).send({status: 'error', message: err}));
    });
};
const deleteInviteTodo = async (req, res) => {
    console.log(req.params)
    console.log(req.body)
    const list = await Todo.findOne({_id: req.params.todoId, createdBy: req.body.userId});
    let data = {};
    data.updatedBy = req.body.userId;
    data.invites = list.invites;
    data.invites = JSON.parse(JSON.stringify(data.invites)).filter(item => item !== req.params.userId);
    data.updatedAt = Date.now();
    console.log(list.invites);
    console.log(JSON.stringify(data.invites));
    Todo.findOneAndUpdate(
        {_id: req.params.todoId, createdBy: req.body.userId},
        {
            $set: data,
        },
        {new: false})
        .then(() => res.send({status: 'success', message: "Todo invite deleted"}))
        .catch((err) => res.sendStatus(500).send({status: 'error', message: err}));
};
const inviteTodo = async (req, res) => {
    const list = await Todo.findOne({_id: req.params.todoId, createdBy: req.body.userId});
    const sender = await User.findById({_id: req.body.userId});
    const receiver = await User.findOne({email: req.body.emails, deletedAt: null});
    if (!receiver) {
        return res.json({
            status: "error",
            message: "User with that email don't exists"
        });
    }
    let data = {};
    data.updatedBy = req.body.userId;
    data.invited = list.invited;
    data.invited.push(JSON.parse(JSON.stringify(receiver._id)));
    data.updatedAt = Date.now();
    Todo.findOneAndUpdate(
        {_id: req.params.todoId, createdBy: req.body.userId},
        {
            $set: data,
        },
        {new: false})
        .then(() => {
            transport.sendMail({
                from: 'todo@todemo.io',
                to: receiver.email,
                subject: `Todo List Invitation: ${list.title}`,
                html: `<p>Hello ${receiver.name},</p>` +
                    `<p>You have been invited to collaborate on todo list: <b>${list.title}</b> by <b>${sender.name}</b></p>` +
                    `<p>Please accept this invite by <a href="${process.env.APP_URL}/todos/invite/accept/${list._id}/${receiver._id}">click here</a></p>` +
                    `<br>` +
                    `Best wishes,<br>` +
                    `ToDo Guys.`,
                text: `Hello ${receiver.name},\r\n` +
                    `You have been invited to collaborate on todo list: ${list.title} by ${sender.name}\r\n` +
                    `Please accept this invite by going to this link ${process.env.APP_URL}/todos/invite/accept/${list._id}/${receiver._id} \r\n` +
                    `\r\n` +
                    `Best wishes,\r\n` +
                    `ToDo Guys.\r\n`
            }, (err, info) => {
                if (err) {
                    console.log(err);
                }
                console.log("Info: ", info);
                res.json({status: 'success', message: "Todo invite sent"})
            });
        })
        .catch((err) => res.sendStatus(500).send({status: 'error', message: err}));
};
const removeTodo = (req, res) => {
    let data = req.body;
    data.deletedBy = req.body.userId;
    data.deletedAt = Date.now();
    Todo.findOneAndUpdate(
        {_id: req.params.todoId, createdBy: req.body.userId},
        {
            $set: data,
        },
        {new: false}).then(() => res.json({status: 'success', message: "Todo Deleted"}))
        .catch((err) => res.sendStatus(500).send({status: 'error', message: err}));
};

module.exports = {
    searchTodos,
    getAll,
    createTodo,
    editTodo,
    toggleTodo,
    removeTodo,
    getTodo,
    inviteTodo,
    deleteInviteTodo,
};
