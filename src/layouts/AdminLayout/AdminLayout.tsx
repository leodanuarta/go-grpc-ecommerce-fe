import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';
import { useAuthStore } from '../../store/auth';

function AdminLayout() {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn)
    const userRole = useAuthStore(state => state.role)
    const navigate = useNavigate()

    useEffect(() => {
        if(userRole !== 'admin' || !isLoggedIn){
            navigate('/')
        }
    }, []);

    return (
        <div className="admin-layout">
            <AdminNavbar />
            <Outlet />
        </div>
    );
}

export default AdminLayout;
