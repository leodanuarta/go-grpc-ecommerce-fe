import { useEffect, useState } from "react";
import { getProductClient } from "../../api/grpc/client";
import useGrpcApi from "../../hooks/useGrpcApi";
import { formatToIdr } from "../../utils/number";
import Pagination from "../Pagination/Pagination";


interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

function ProductListSection() {
    const listApi = useGrpcApi();    
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchData = async() => {
            const res = await listApi.callApi(getProductClient().listProduct({
                pagination: {
                    currentPage: currentPage,
                    itemPerPage: 8,
                }
            }));

            setItems(res.response.data.map(d => ({
                id: d.id,
                imageUrl: d.imageUrl,
                name: d.name,
                price: d.price,
            })));
            setTotalPages(res.response.pagination?.totalPageCount ?? 0);
        }

        fetchData()
    }, [currentPage])

    return (
        <div className="untree_co-section product-section before-footer-section">
            <div className="container">
                <div className="row">

                    {items.map(item => (
                        <div key={item.id} className="col-12 col-md-4 col-lg-3 mb-5">
                            <a className="product-item" href="#">
                                <img src={item.imageUrl} className="img-fluid product-thumbnail" />
                                <h3 className="product-title">{item.name}</h3>
                                <strong className="product-price">{formatToIdr(item.price)}</strong>

                                <span className="icon-cross">
                                    <img src="images/cross.svg" className="img-fluid" />
                                </span>
                            </a>
                        </div>
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

export default ProductListSection