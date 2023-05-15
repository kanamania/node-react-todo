import {Box, Container, Typography} from "@mui/material"
import {useState} from "react";

const ProfilePage = () => {
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    backgroundColor: "#ece9e9",
                    mt: "2rem",
                    height: "15rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{color: "#1f1e1e", fontWeight: 500}}
                >
                    Profile Page
                </Typography>
            </Box>
            <Box sx={{mt: 2}}>
                <Typography gutterBottom>
                    <strong>Name:</strong> {user?.name}
                </Typography>
                <Typography gutterBottom>
                    <strong>Email Address:</strong> {user?.email}
                </Typography>
                <Typography gutterBottom>
                    <strong>Role:</strong> {user?.role}
                </Typography>
            </Box>
        </Container>
    )
}

export default ProfilePage
