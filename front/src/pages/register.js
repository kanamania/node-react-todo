import { Box, Container, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { FormProvider, useForm } from "react-hook-form"
import { object, string } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {useEffect, useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { LoadingButton as _LoadingButton } from "@mui/lab"
import { toast } from "react-toastify"
import FormInput from "../features/FormInput";
import {login, register} from '../features/api/auth';
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

const registerSchema = object({
    name: string()
        .min(1, "Full name is required")
        .max(100),
    email: string()
        .min(1, "Email address is required")
        .email("Email Address is invalid"),
    password: string()
        .min(1, "Password is required")
        .min(6, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string().min(1, "Please confirm your password")
}).refine(data => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match"
})

const RegisterPage = () => {
    const methods = useForm({
        resolver: zodResolver(registerSchema)
    })

    // ? Calling the Register Mutation
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        reset,
        handleSubmit,
        formState: { isSubmitSuccessful }
    } = methods

    useEffect(() => {
        if (isSuccess) {
            toast.success("User registered successfully")
            navigate("/verifyemail")
        }

    }, [isSuccess])

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }
    }, [isSubmitSuccessful])

    const onSubmitHandler = values => {
        // ? Executing the RegisterUser Mutation
        setIsLoading(true);
        const {email, password} = values;
        register(values.name, values.email, values.password).then(res => {
            setIsLoading(false);
            if (res.data?.status === 'success') {
                setIsSuccess(true);
                login(email, password).then(r => {
                    if(r.status === 'success'){
                        navigate('/');
                    }
                });
            }
        })
    }

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
                        fontSize: { xs: "2rem", md: "3rem" },
                        fontWeight: 600,
                        mb: 2,
                        letterSpacing: 1
                    }}
                >
                    Welcome to ToDo Guys!
                </Typography>
                <Typography component="h2" sx={{ color: "#e5e7eb", mb: 2 }}>
                    Sign Up To Get Started!
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
                        <FormInput iref={"Full Name"} name="name" label="Full Name" />
                        <FormInput iref={"Email"} name="email" label="Email Address" type="email" />
                        <FormInput iref={"Password"} name="password" label="Password" type="password" />
                        <FormInput iref={"Confirm Password"}
                            name="passwordConfirm"
                            label="Confirm Password"
                            type="password"
                        />
                        <Typography sx={{ fontSize: "0.9rem", mb: "1rem" }}>
                            Already have an account?{" "}
                            <LinkItem to="/login">Login Here</LinkItem>
                        </Typography>

                        <LoadingButton
                            variant="contained"
                            sx={{ mt: 1 }}
                            fullWidth
                            disableElevation
                            type="submit"
                            loading={isLoading}
                        >
                            Sign Up
                        </LoadingButton>
                    </Box>
                </FormProvider>
            </Box>
        </Container>
    )
}

export default RegisterPage
