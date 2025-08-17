import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

// dapatkan dulu id nya
// get detail product dengan id
// assign value detail ke form edit
// edit
// submit

function AdminEditProduct() {
    const {id} = useParams();
    const detailAPI = useGrpcApi();
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const editProductAPI = useGrpcApi();
    const [defaultValues, setDefaultValues] = useState<ProductFormValues | undefined>(undefined)

    useEffect(() => {
        const fetchData = async () => {
            const resp = await detailAPI.callApi(getProductClient().detailProduct({
                id: id ?? ''
            }));

            setDefaultValues({
                name: resp.response.name,
                price: resp.response.price,
                description: resp.response.description,
                image: new DataTransfer().files,
                imageUrl: resp.response.imageUrl
            });
        };

        fetchData();
    }, [id]); // only refetch if id changes

    
    const submitHandler = async (values: ProductFormValues)  => {
        try{
            setUploadLoading(true);
            let newImageFileName = "";
            if (values.image.length > 0){
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

                newImageFileName = postImage.data.file_name;
            }

            await editProductAPI.callApi(getProductClient().editProduct({
                id: id ?? '',
                description: values.description ?? "",
                imageFileName: newImageFileName ,
                name: values.name,
                price:values.price,
            }));

            Swal.fire({
                title: "Edit produk sukses",
                icon: "success"
            })

            navigate('/admin/products');
        }finally{
            setUploadLoading(false)
        }
    }

    return (
        <>
            <PlainHeroSection title='Edit Produk' />

            <div className="untree_co-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <ProductForm 
                                onSubmit={submitHandler}
                                disabled={editProductAPI.isLoading || uploadLoading || detailAPI.isLoading}
                                defaultValues={defaultValues}
                                isEdit
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminEditProduct;
