import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductClient } from '../../api/grpc/client';
import useGrpcApi from '../../hooks/useGrpcApi';
import useSortableHeader from '../../hooks/useSortableHeader';
import { formatToIdr } from '../../utils/number';
import Pagination from '../Pagination/Pagination';
import SortableHeader from '../SortableHeader/SortableHeader';


interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}


function AdminProductListSection() {
    const listAPI = useGrpcApi();
    const { handleSort, sortConfig } = useSortableHeader();
    const [items, setItems] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchData = async () => {
            const resp = await listAPI.callApi(getProductClient().listProductAdmin({
                pagination: {
                    currentPage: currentPage,
                    itemPerPage: 2,
                    sort: sortConfig.direction ?{
                        direction: sortConfig.direction,
                        field: sortConfig.key
                    }: undefined
                }
            }));

            setItems(resp.response.data.map(d => ({
                id: d.id,
                name: d.name,
                imageUrl: d.imageUrl,
                price: d.price,
                description: d.description, 
            })));
            setTotalPages(resp.response.pagination?.totalPageCount ?? 0)

        }

        fetchData();
    }, [currentPage, sortConfig.direction, sortConfig.key])

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="section-title">Produk</h2>
                <Link to="/admin/products/create">
                    <button className="btn btn-primary">Tambah Produk</button>
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table site-blocks-table">
                    <thead>
                        <tr>
                            <th>Gambar</th>
                            <SortableHeader
                                label="Nama Produk"
                                sortKey="name"
                                currentSort={sortConfig}
                                onSort={handleSort}
                            />
                            <SortableHeader
                                label="Harga"
                                sortKey="price"
                                currentSort={sortConfig}
                                onSort={handleSort}
                            />
                            <SortableHeader
                                label="Deskripsi"
                                sortKey="description"
                                currentSort={sortConfig}
                                onSort={handleSort}
                            />
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(i => (
                            <tr key={i.id}>
                                <td>
                                    <img src={i.imageUrl} width="50" alt="Produk" />
                                </td>
                                <td>{i.name}</td>
                                <td>{formatToIdr(i.price)}</td>
                                <td>{i.description}</td>
                                <td>
                                    <button className="btn btn-secondary me-2">Edit</button>
                                    <button className="btn">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

        </div>
    );
}

export default AdminProductListSection;
