import React, {useEffect, useState} from 'react'
import {addTodo, deleteTodo, getAll, toggleTodo, updateTodo, getOne} from "./api/data";
import Loader from "./Loader";
import {
    Box,
    TextField,
    Button,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Typography,
    Select, MenuItem
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CoPresent from "@mui/icons-material/CoPresent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {object, string} from "zod";
import {useForm, FormProvider} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify"
import {useLocation, useNavigate, useParams} from "react-router-dom";
import InviteDialog from "./InviteDialog";
import {CURRENT_USER_ID} from "../App";

const SEARCH_DELAY = 250;
const todoForm = object({
    title: string()
        .min(1, "Todo title is required")
});

function TodoList() {
    const navigate = useNavigate();
    const location = useLocation();
    const {todoId} = useParams();
    const todoMethods = useForm({
        resolver: zodResolver(todoForm)
    });
    const {
        reset: todoFormReset,
    } = todoMethods;
    const [inputField, setInputField] = useState({
        title: '',
        description: '',
    });
    const [isUpdated, setIsUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [currentTodo, setCurrentTodo] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);
    const [isTodoSortOpen, setIsTodoSortOpen] = useState(false);
    const [todoSort, setTodoSort] = useState(10);
    const [todoSortChanged, setTodoSortChanged] = useState(false);
    const [searchField, setSearchField] = useState(null);
    const [searchTime, setSearchTime] = useState(null);
    const [parent, setParent] = useState(null);
    const [listTitle, setListTitle] = useState('List');
    const [invites, setInvites] = useState([]);
    const [todos, setTodos] = useState([]);
    const fetch = () => {
        setTimeout(() =>
            getAll({sort: todoSort, search: searchField, todo: todoId}).then(res => {
                if (res && res.status === 200 && res.data?.data) {
                    setTodos(res.data.data);
                    setIsLoading(false);
                    setIsUpdated(false);
                    setTodoSortChanged(false);
                    setParent(res.data.parent);
                    setListTitle(res.data.parent ? `${res.data.parent.title} (${res.data.data.length})` : `Main List (${res.data.data.length})`);
                }
        }), 500);
    };

    const inputsHandler = (e) => {
        setInputField((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const editingMode = (data) => {
        setInputField({
            title: data.title,
            description: data.description,
        });
        setCurrentId(data.id);
        setIsEditing(true);
    }

    const onEditHandler = (e) => {
        e.preventDefault();
        console.log(inputField)
        updateTodo(currentId, inputField.title, inputField.description).then(res => {
            console.log(res);
            if (res.data?.status === 'success') {
                setIsUpdated(true);
                setIsEditing(false);
                setCurrentId(null);
                toast.success(res.data?.message, {
                    position: "top-right"
                });
            }
        });
    }

    const onAddHandler = (e) => {
        e.preventDefault();
        addTodo(inputField.title, inputField.description, todoId)
            .then(res => {
                if (res.data?.status === 'success') {
                    setIsUpdated(true);
                    toast.success(res.data.message, {
                        position: "top-right"
                    });
                }
            });
    }
    const onDeleteHandler = (id) => {
        deleteTodo(id).then(res => {
            if (res && res.data?.status === 'success') {
                setIsUpdated(true);
                toast.success(res.data?.message, {
                    position: "top-right"
                });
            }
        })
    };
    const viewList = (todo) => {
        if (todo.parentId) {
            console.log('todo item');
            return false;
        }
        navigate(`/${todo.id}`);
    };
    const toggleStatus = (id) => {
        toggleTodo(id).then(res => {
            if (res && res.data?.status === 'success') {
                setIsUpdated(true);
                toast.success(res.data?.message, {
                    position: "top-right"
                });
            }
        })
    };
    const inviteModalHandler = (todo) => {
        setCurrentId(todo.id);
        setCurrentTodo(todo);
        setModalTitle(todo.title);
        getOne(todo.id).then(res => {
            if(res && res.data) {
                setInvites(res.data.invited);
                setIsModalOpen(true);
            }
        });
    };
    const handleModalClose = () => {
        setCurrentId(null);
        setModalTitle(null);
        setIsModalOpen(false);
    };
    const onSearchHandler = (e) => {
        if (!searchTime) {
            setSearchTime(Date.now());
        }
        if (e.target.value === '' || (searchTime && Math.abs(Date.now() - searchTime) > SEARCH_DELAY)) {
            setSearchField(e.target.value ?? null);
            setSearchTime(null);
            setIsUpdated(true);
            return true;
        }
    }

    const handleTodoSortClose = () => setIsTodoSortOpen(false);
    const handleTodoSortOpen = () => setIsTodoSortOpen(true);
    const onTodoSortChange = (e) => {
        console.log(e.target.value)
        setTodoSort(e.target.value);
        setTodoSortChanged(true);
    };

    useEffect(() => {
        if (isUpdated || location) {
            setInputField(() => ({
                title: '',
                description: '',
            }));
            fetch();
            setIsUpdated(false);
            setTodoSortChanged(false);
        }
    }, [isUpdated, setInputField, location]);

    const styles = theme => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing.unit * 2,
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        inline: {
            display: 'inline',
        },
        finished: {
            backgroundColor: '#848584'
        }
    });
    let todoContent;

    if (isLoading) {
        todoContent = (
            <Loader/>
        )
    } else if (todos.length) {
        todoContent = todos.map((item) => {
            return (
                <ListItem
                    sx={item.isFinished ? {backgroundColor: '#848584'} : {}}
                    divider
                    gutters={2}
                    key={item.id}>
                    <ListItemText
                        primary={`${item.title}`}
                        secondary={
                            <React.Fragment>
                                <Typography component="span" className={styles.inline} color="textPrimary">
                                    {item.description}
                                </Typography>
                            </React.Fragment>
                        }
                        sx={{cursor: 'pointer'}}
                        onClick={() => viewList(item)}
                    />
                    <ListItemSecondaryAction>
                        <Checkbox
                            title={item.isFinished ? 'Open' : 'Close'}
                            onChange={() => toggleStatus(item.id)}
                            checked={item.isFinished}
                        />
                        {(!item.parentId && item.createdBy === CURRENT_USER_ID) &&
                            <IconButton
                                onClick={() => inviteModalHandler(item)}>
                                <CoPresent/>
                            </IconButton>
                        }
                        {item.createdBy === CURRENT_USER_ID &&
                        <IconButton
                            onClick={() => editingMode(item)}>
                            <EditIcon/>
                        </IconButton>
                        }
                        {item.createdBy === CURRENT_USER_ID &&
                        <IconButton
                            onClick={() => onDeleteHandler(item.id)}>
                            <DeleteIcon/>
                        </IconButton>
                        }
                    </ListItemSecondaryAction>
                </ListItem>
            )
        })
    }

    return (
        <Grid
            sx={{mt: 5}}
            container
            direction="row"
            justify="center"
            alignItems="flex-start">
            <Grid id="todoForm" item xs={12} sm={4} sx={{pr: 5}}>
                <Typography variant="h5" sx={{pb: 3}}>Todo Form</Typography>
                <FormProvider {...todoMethods}>
                    <form onSubmit={() => isEditing ? onAddHandler : onEditHandler}>
                        <Box sx={{mb: 3}}>
                            <TextField
                                label="Title"
                                name="title"
                                id="title"
                                value={inputField.title}
                                onChange={inputsHandler}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{mb: 3}}>
                            <TextField
                                label="Description"
                                name="description"
                                id="description"
                                value={inputField.description}
                                onChange={inputsHandler}
                                multiline
                                fullWidth
                                minRows={3}/>
                        </Box>
                        {!isEditing && (
                            <Button className="todoButton"
                                onClick={onAddHandler}
                                variant="outlined" color="secondary" type="submit">Add</Button>
                        )}
                        {isEditing && (
                            <Button className="todoButton"
                                onClick={onEditHandler}
                                variant="outlined" color="secondary" type="submit">Update</Button>
                        )}
                    </form>
                </FormProvider>
            </Grid>

            <Grid id="todoList" item xs={12} sm={8}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="flex-start">
                    <Grid item xs={4} sm={2}>
                        <Select
                            open={isTodoSortOpen}
                            onClose={handleTodoSortClose}
                            onOpen={handleTodoSortOpen}
                            value={todoSort}
                            onChange={onTodoSortChange}
                            inputProps={{
                                name: 'todo-sort',
                                id: 'todo-sort-select',
                            }}
                        >
                            <MenuItem value={10}>New First</MenuItem>
                            <MenuItem value={11}>Old First</MenuItem>
                            <MenuItem value={20}>Title Z-A</MenuItem>
                            <MenuItem value={21}>Title A-Z</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={8} sm={10}>
                        <TextField
                            label="Search"
                            name="search"
                            id="search"
                            onChange={(e) => onSearchHandler(e)}
                            inputProps={{
                                name: 'todo-search',
                                id: 'todo-search'
                            }}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container
                      sx={{py: 3}}
                      direction="row"
                      justify="center"
                      alignItems="flex-start">
                    <Grid item xs={9} sm={9}>
                        <Typography variant="h5">{listTitle}</Typography>
                    </Grid>
                    <Grid item xs={3} sm={3} sx={{display: 'flex', justifyContent: 'end'}}>
                        {parent &&
                            <Button
                                onClick={() => navigate('/')}
                                sx={{p: 0}}>
                                <ArrowBackIcon/>
                                <Typography variant="h6" sx={{textTransform: 'capitalize'}}>Main</Typography>
                            </Button>
                        }
                    </Grid>
                </Grid>
                <List>{todoContent}</List>
                <InviteDialog todo={currentTodo}
                              modalTitle={modalTitle}
                              invites={invites}
                              handleModelClose={handleModalClose}
                              isModalOpen={isModalOpen}
                              setIsModalOpen={setIsModalOpen}
                              setIsUpdated={setIsUpdated}/>
            </Grid>
        </Grid>
    )
}

export default TodoList
