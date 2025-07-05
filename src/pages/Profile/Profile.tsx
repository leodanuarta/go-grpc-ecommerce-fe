import { RpcError } from '@protobuf-ts/runtime-rpc';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAuthClient } from '../../api/grpc/client';
import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection';
import { useAuthStore } from '../../store/auth';
import { convertTimestampToDate } from '../../utils/date';

function Profile() {
    const location = useLocation();
    const navigate = useNavigate();
    const logoutUser = useAuthStore(state => state.logout)
    const [fullName, setFullName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [memberSince, setMemberSince] = useState<string>();

    useEffect(() => {
        if (location.pathname === '/profile') {
            navigate('/profile/change-password');
        }
    }, [navigate, location.pathname]);


    useEffect(() => {
        const fetchProfile = async() => {
            try {
                const resp = await getAuthClient().getProfile({})

                if (resp.response.base?.isError ?? true){
                    Swal.fire({
                        icon: 'error',
                        title: 'Terjadi Kesalahan',
                        text: 'Silahkan coba beberapa saat lagi',
                    })

                    return
                }

                setFullName(resp.response.fullName)
                setEmail(resp.response.email)

                const datStr = convertTimestampToDate(resp.response.memberSince)
                setMemberSince(datStr)
            
            }catch(e){
                if (e instanceof RpcError){
                    if (e.code === "UNAUTHENTICATED"){
                        logoutUser();
                        localStorage.removeItem('access_token');
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sesi Telah Berakhir',
                            text: 'Silahkan login ulang kembali',
                            confirmButtonText: 'OK',
                        })
                        navigate('/login')
                        return
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'Terjadi Kesalahan',
                        text: 'Silahkan coba beberapa saat lagi',
                        confirmButtonText: 'OK',
                    })

                    return
                }
            }
        }

        fetchProfile();
    }, [])


    return (
        <>
            <PlainHeroSection title='Profil Saya' />

            <div className="untree_co-section before-footer-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-12">
                            <div className="p-4 p-lg-5 border bg-white">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="text-black">Nama Lengkap</label>
                                            <div className="form-control-plaintext">{fullName}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="text-black">Alamat Email</label>
                                            <div className="form-control-plaintext">{email}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="text-black">Anggota Sejak</label>
                                            <div className="form-control-plaintext">{memberSince}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="nav flex-column nav-pills">
                                <Link
                                    to="/profile/change-password"
                                    className={`nav-link ${location.pathname === '/profile/change-password' ? 'active' : ''}`}
                                >
                                    Ubah Kata Sandi
                                </Link>
                                <Link
                                    to="/profile/orders"
                                    className={`nav-link ${location.pathname === '/profile/orders' ? 'active' : ''}`}
                                >
                                    Riwayat Pesanan
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
