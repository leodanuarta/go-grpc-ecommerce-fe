import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useAuthStore } from '../../store/auth';

function AuthLayout() {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn)
    const navigate = useNavigate()

    useEffect(() => {
        if(isLoggedIn){
            navigate('/')
        }
    }, []);

    return (
        <>
            <Navbar />

            <Outlet />
        </>
    );
}

export default AuthLayout;
