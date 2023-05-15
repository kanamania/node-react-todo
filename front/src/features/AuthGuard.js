import { Navigate, Outlet, useLocation } from "react-router-dom"
import Loader from "./Loader"
import {useState} from "react";

const AuthGuard = () => {
    const location = useLocation()

    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

    if (loading) {
        return <Loader />
    }

    return (user) ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default AuthGuard;
