import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getProductClient } from '../../api/grpc/client';
import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection';
import ProductForm from '../../components/ProductForm/ProductForm';
import useGrpcApi from '../../hooks/useGrpcApi';
import { type ProductFormValues } from "../../types/product";

interface uploadImageResponse {
    file_name: string;
    message: string;
    success: boolean;
}

function AdminCreateProduct() {
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const createProductAPI = useGrpcApi();

    
    const submitHandler = async (values: ProductFormValues)  => {
        try{
            setUploadLoading(true)
            const formData = new FormData();
            formData.append("image", values.image[0])
            const postImage = await axios.post<uploadImageResponse>('http://localhost:8081/product/upload',formData)
            if (postImage.status !== 200){
                Swal.fire({
                    title: 'Upload Gambar Gagal',
                    text: 'Silahkan coba beberapa saat lagi',
                    icon: 'error'
                })
                return
            }

            await createProductAPI.callApi(getProductClient().createProduct({
                description: values.description ?? "",
                name: values.name,
                price:values.price,
                imageFileName: postImage.data.file_name,
            }));

            Swal.fire({
                title: "Tambah produk sukses",
                icon: "success"
            })

            navigate('/admin/products');
        }finally{
            setUploadLoading(false)
        }
    }

    return (
        <>
            <PlainHeroSection title='Tambah Produk' />

            <div className="untree_co-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <ProductForm 
                                onSubmit={submitHandler}
                                disabled={createProductAPI.isLoading || uploadLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminCreateProduct;
