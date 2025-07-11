import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { type ProductFormValues } from "../../types/product";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import FormInput from "../FormInput/FormInput";


const createProductSchema = yup.object().shape({
    name: yup.string().required('Nama produk wajib diisi'),
    price: yup.number().required('Harga produk wajib diisi').typeError('Harga produk tidak valid').moreThan(0, 'Harga produk harus lebih dari 0'),
    description: yup.string(),
    image: yup.mixed<FileList>().required('Gambar produk wajid diisi')
        .test('filelength', 'Gambar produk wajib diisi', (filelist) => {
            return filelist.length > 0
        })
        .test('fileType', 'Format gambar tidak valid', (filelist) => {
            return filelist && filelist.length > 0  ? ["image/jpeg", "image/png"].includes(filelist[0].type) : true
        })


})

interface ProductFormProps{
    onSubmit: (values: ProductFormValues) => void;
    disabled?: boolean;
}


function ProductForm(props : ProductFormProps) {
    const form = useForm<ProductFormValues>({
        resolver: yupResolver(createProductSchema)
    })

    const submitHandler = (values: ProductFormValues) => {
        props.onSubmit(values)
    }

    return (
        <div className="p-4 p-lg-5 border bg-white">
            <form onSubmit={form.handleSubmit(submitHandler)}>
                <FormInput<ProductFormValues>
                    errors={form.formState.errors}
                    name="name"
                    register={form.register}
                    type="text"
                    label="Nama Produk"
                    placeholder="Nama Produk"
                    lableRequired
                    disabled={props.disabled}
                />

                <CurrencyInput<ProductFormValues>
                    errors={form.formState.errors}
                    name="price"
                    control={form.control}
                    label="Harga"
                    placeholder="Harga Produk"
                    lableRequired
                    disabled={props.disabled}
                />

                <FormInput<ProductFormValues>
                    errors={form.formState.errors}
                    name="description"
                    register={form.register}
                    type="textarea"
                    label="Deskripsi Produk"
                    placeholder="Deskripsi Produk ..."
                    disabled={props.disabled}
                />

                <FormInput<ProductFormValues>
                    errors={form.formState.errors}
                    name="image"
                    register={form.register}
                    type="image"
                    label="Gambar Produk"
                    placeholder="Gambar Produk"
                    lableRequired
                    disabled={props.disabled}
                />

                <div className="form-group">
                    <button type="submit" disabled={props.disabled}  className="btn btn-primary">Simpan Produk</button>
                </div>
            </form>
        </div>
    )
}

export default ProductForm;
