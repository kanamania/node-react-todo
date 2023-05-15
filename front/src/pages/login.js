import { Box, Container, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { FormProvider, useForm } from "react-hook-form"
import { object, string } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import FormInput from "../features/FormInput"
import React, {useEffect, useState} from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LoadingButton as _LoadingButton } from "@mui/lab"
import {login} from "../features/api/auth";

const LoadingButton = styled(_LoadingButton)`
  padding: 0.6rem 0;
  background-color: #f9d13e;
  color: #2363eb;
  font-weight: 500;

  &:hover {
    background-color: #ebc22c;
    transform: translateY(-2px);
  }
`

const LinkItem = styled(Link)`
  text-decoration: none;
  color: #2363eb;
  &:hover {
    text-decoration: underline;
  }
`

const loginSchema = object({
    email: string()
        .min(1, "Email address is required")
        .email("Email Address is invalid"),
    password: string()
        .min(1, "Password is required")
        .min(6, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters")
});

const LoginPage = () => {
    const methods = useForm({
        resolver: zodResolver(loginSchema)
    })
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from.pathname || "/";
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

    const {
        reset,
        handleSubmit,
        formState: { isSubmitSuccessful }
    } = methods

    const onSubmitHandler = async values => {
        return login(values.email, values.password).then(res => {
            if (res.status === 'success') {
                setTimeout(() => setIsLoggedIn(true), 2000);
                reset();
            }
        })
    }
    useEffect(() => {
        if (user || isLoggedIn || localStorage.getItem('accessToken')) {
            navigate('/');
        }
    }, [user, isLoggedIn]);

    return (
        <Container
            maxWidth={false}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#5bb15e"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column"
                }}
            >
                <Typography
                    textAlign="center"
                    component="h1"
                    sx={{
                        color: "#f9d13e",
                        fontWeight: 600,
                        fontSize: { xs: "2rem", md: "3rem" },
                        mb: 2,
                        letterSpacing: 1
                    }}
                >
                    Welcome!
                </Typography>
                <FormProvider {...methods}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmitHandler)}
                        noValidate
                        autoComplete="off"
                        maxWidth="27rem"
                        width="100%"
                        sx={{
                            backgroundColor: "#e5e7eb",
                            p: { xs: "1rem", sm: "2rem" },
                            borderRadius: 2
                        }}
                    >
                        <FormInput name="email" label="Email Address" type="email" />
                        <FormInput name="password" label="Password" type="password" />

                        <Typography sx={{ fontSize: "0.9rem", mb: "1rem" }}>
                            Need an account? <LinkItem to="/register">Sign Up Here</LinkItem>
                        </Typography>

                        <LoadingButton
                            variant="contained"
                            sx={{ mt: 1 }}
                            fullWidth
                            disableElevation
                            type="submit"
                            loading={isLoading}
                        >
                            Login
                        </LoadingButton>
                    </Box>
                </FormProvider>
            </Box>
        </Container>
    )
}

export default LoginPage
