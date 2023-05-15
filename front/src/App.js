import {Container, CssBaseline} from "@mui/material"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Layout from "./features/Layout"
import ProfilePage from "./pages/profile"
import HomePage from "./pages/home"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import UnauthorizedPage from "./pages/unauthorized"
import EmailVerificationPage from "./pages/verifyemail"
import AuthGuard from "./features/AuthGuard"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

function App() {
    return (
        <Container id="mainContainer">
            <CssBaseline/>
            <ToastContainer/>
            <BrowserRouter>
                <Routes>
                    <Route element={<AuthGuard/>}>
                        <Route path="/" element={<Layout/>}>
                            <Route index element={<HomePage/>}/>
                            <Route path=":todoId" element={<HomePage/>}/>
                            <Route path="profile" element={<ProfilePage/>}/>
                        </Route>
                    </Route>
                    <Route path="/" element={<Layout/>}>
                        <Route path="unauthorized" element={<UnauthorizedPage/>}/>
                        <Route path="verifyemail" element={<EmailVerificationPage/>}>
                            <Route path=":verificationCode" element={<EmailVerificationPage/>}/>
                        </Route>
                        <Route path="login" element={<LoginPage/>}/>
                        <Route path="register" element={<RegisterPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </Container>
    )
}

export default App
