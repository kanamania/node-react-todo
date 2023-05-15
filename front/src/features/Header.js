import {
    AppBar,
    Avatar,
    Box,
    Container,
    IconButton,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material"
import {styled} from "@mui/material/styles"
import {useNavigate} from "react-router-dom"
import {LoadingButton as _LoadingButton} from "@mui/lab"
import {useEffect, useState} from "react";

const LoadingButton = styled(_LoadingButton)`
  padding: 0.4rem;
  background-color: #f9d13e;
  color: #2363eb;
  font-weight: 500;

  &:hover {
    background-color: #ebc22c;
    transform: translateY(-2px);
  }
`

const Header = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const [loggedOut, setLoggedOut] = useState(null);

    useEffect(() => {
        if (loggedOut) {
            navigate("/login");
        }
    }, [loggedOut])
    const onLogoutHandler = async () => {
        console.log('header')
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setLoggedOut(true);
    }

    return (
        <AppBar position="static" sx={{bgcolor: '#5bb15e', borderBottom: '1px solid #318933'}}>
            <Container maxWidth="lg">
                <Toolbar>
                    <Typography
                        variant="h6"
                        onClick={() => navigate("/")}
                        sx={{cursor: "pointer"}}
                    >
                        ToDo Guys
                    </Typography>
                    <Box display="flex" sx={{ml: "auto"}}>
                        {!user && (
                            <>
                                <LoadingButton
                                    sx={{mr: 2, color: '#2363eb'}}
                                    onClick={() => navigate("/register")}
                                >
                                    SignUp
                                </LoadingButton>
                                <LoadingButton sx={{color: '#2363eb'}} onClick={() => navigate("/login")}>
                                    Login
                                </LoadingButton>
                            </>
                        )}
                        {user && (
                            <LoadingButton
                                sx={{backgroundColor: "#eee"}}
                                onClick={() => onLogoutHandler()}
                            >
                                Logout
                            </LoadingButton>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Header
