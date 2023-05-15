import React, {useState} from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle, IconButton,
    List,
    ListItem, ListItemSecondaryAction,
    ListItemText,
    Typography
} from "@mui/material";
import {FormProvider, useForm} from "react-hook-form";
import FormInput from "./FormInput";
import LoadingButton from "@mui/lab/LoadingButton";
import {deleteTodoInvite, inviteTodo} from "./api/data";
import {toast} from "react-toastify";
import {object, string} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import DeleteIcon from "@mui/icons-material/Delete";

const inviteForm = object({
    email: string()
        .min(1, "Email address is required")
        .email("Email Address is invalid"),
})

const InviteDialog = ({todo, invites, modalTitle, isModalOpen, setIsModalOpen, handleModelClose, setIsUpdated}) => {
    const [invitees, setInvitees] = useState(invites);
    const inviteMethods = useForm({
        resolver: zodResolver(inviteForm)
    })
    const {
        reset,
        handleSubmit: handleInviteFormSubmit,
    } = inviteMethods;
    const onInviteHandler = (values) => {
        console.log(todo)
        inviteTodo(todo.id, values.email).then(res => {
            if (res && res.data?.status === 'success') {
                setIsUpdated(true);
                toast.success(res.data?.message, {
                    position: "top-right"
                });
                reset();
                setIsModalOpen(false);
            }
        });
    };
    const onDeleteInviteHandler = (e, todoId, userId) => {
        deleteTodoInvite(todoId, userId).then(res => {
            console.log(res)
            if(res && res.data) {
                if(res.data.status === 'success'){
                    setIsUpdated(true);
                    setInvitees(invitees.filter(i => i._id !== userId));
                }
            }
        });
    };
    let InvitedBox = null;
    if (invites?.length) {
        InvitedBox = () => {
            return (
                <Box>
                    <Typography variant='h7' sx={{}}>Invites</Typography>
                    <List>
                        {(invites?.length > 0) && invites?.map((item) => {
                            return (
                                <ListItem
                                    key={item._id}
                                    divider
                                >
                                    <ListItemText primary={`${item.name} (Accepted)`} secondary={
                                        <React.Fragment>
                                            <Typography component="i" color="textDark">{item.email}</Typography>
                                        </React.Fragment>
                                    } />
                                    {(item._id===todo.createdBy) &&
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            onClick={(e) => onDeleteInviteHandler(e, todo.id, item.id)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                    }
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            );
        };
    } else {
        InvitedBox = () => {
            return (<Typography component="i" color="textDark">None yet.</Typography>)
        };
    }
    return (
        <Dialog
            open={isModalOpen}
            onClose={handleModelClose}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Invite other participant</DialogTitle>
            <DialogContent>
                <DialogContentText><b>List:</b> {modalTitle}</DialogContentText>
                <FormProvider {...inviteMethods}>
                    <Box
                        component="form"
                        onSubmit={handleInviteFormSubmit(onInviteHandler)}
                        noValidate
                        autoComplete="off"
                        width="100%"
                    >
                        <FormInput name="email" label="Email Address" type="email"/>
                        <Typography variant='span' sx={{fontSize: 12}}>
                            Enter email address of participant you wish to invite to this list
                        </Typography>
                        <Box sx={{justifyContent: 'flex-end', display: 'flex'}}>
                            <LoadingButton type="submit" color="primary">
                                Invite
                            </LoadingButton>
                        </Box>
                    </Box>
                    <InvitedBox/>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default InviteDialog;