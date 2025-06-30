import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { useAuthStore } from '../../store/auth';

function ECommerceLayout() {
    const userRole = useAuthStore(state => state.role)
    const navigate = useNavigate()

    useEffect(() => {
        if(userRole === 'admin'){
            navigate('/admin/dashboard')
        }
    }, []);

    return (
        <>
            <Navbar />

            <Outlet />

            <Footer />
        </>
    );
}

export default ECommerceLayout;
