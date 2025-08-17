import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductClient } from '../../api/grpc/client';
import useGrpcApi from '../../hooks/useGrpcApi';
import { formatToIdr } from '../../utils/number';

interface ProductHighlightSectionProps {
    beforeFooter?: boolean;
}

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

function ProductHighlightSection(props: ProductHighlightSectionProps) {
    const productApi = useGrpcApi();
    const [items, setItems] = useState<Product[]>([]);
    useEffect(() => {
        const fethData = async () => {
            const res = await productApi.callApi(getProductClient().highlightProducts({}));

            setItems(res.response.data.map(d => ({
                id: d.id,
                name: d.name,
                imageUrl: d.imageUrl,
                price: d.price,
            })))
        }

        fethData();
    }, [])

    return (
        <div className={`product-section ${props.beforeFooter ? 'before-footer-section' : ''}`}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
                        <h2 className="mb-4 section-title">Dibuat dengan material terbaik.</h2>
                        <p className="mb-4">Rasakan perpaduan sempurna antara keahlian dan daya tahan. Furnitur kami dibuat dengan material premium untuk meningkatkan estetika dan kenyamanan ruang Anda.</p>
                        <p><Link to="/shop" className="btn">Jelajahi</Link></p>
                    </div>

                    {items.map(item => (
                        <div key={item.id} className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                            <Link className="product-item" to="/cart">
                                <img src={item.imageUrl} className="img-fluid product-thumbnail" alt="product_image" />
                                <h3 className="product-title">{item.name}</h3>
                                <strong className="product-price">{formatToIdr(item.price)}</strong>
                                <span className="icon-cross">
                                    <img src="/images/cross.svg" className="img-fluid" alt="Cross" />
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductHighlightSection;
