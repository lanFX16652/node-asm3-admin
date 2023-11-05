import React, { useEffect, } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from "../../store/userSlice.js";


const AuthWrapper = () => {
    const userLocalStorage = JSON.parse(localStorage.getItem("user"));
    const userRedux = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        if (!userRedux) {
            dispatch(setUser(userLocalStorage))
        }


    }, [dispatch, userLocalStorage, userRedux])

    useEffect(() => {
        if (!userLocalStorage) {
            navigate("/login");
        }
    }, [navigate, userLocalStorage])


    return <Outlet />;
}

export default AuthWrapper