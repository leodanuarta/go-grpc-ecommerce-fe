import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import FormInput from "../FormInput/FormInput";


const createProductSchema = yup.object().shape({
    name: yup.string().required('Nama produk wajib diisi'),
    // price: yup.number().required('Harga produk wajib diisi').typeError('Harga produk tidak valid').moreThan(0, 'Harga produk harus lebih dari 0'),
    description: yup.string(),
    image: yup.mixed<FileList>().required('Gambar produk wajid diisi')
        .test('filelength', 'Gambar produk wajib diisi', (filelist) => {
            return filelist.length > 0
        })
        .test('fileType', 'Format gambar tidak valid', (filelist) => {
            return filelist && filelist.length > 0  ? ["image/jpeg", "image/png"].includes(filelist[0].type) : true
        })


})

interface ProductFormValues{
    name: string, 
    // price: number,
    description?: string,
    image: FileList,
}

function ProductForm() {
    const form = useForm<ProductFormValues>({
        resolver: yupResolver(createProductSchema)
    })

    const submitHandler = (values: ProductFormValues) => {
        console.log(values)
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
                />

                <div className="form-group mb-3">
                    <label className="text-black" htmlFor="product_price">Harga <span className="text-danger">*</span></label>
                    <input type="number" className="form-control" id="product_price" placeholder="Harga Produk" />
                </div>
                <FormInput<ProductFormValues>
                    errors={form.formState.errors}
                    name="image"
                    register={form.register}
                    type="image"
                    label="Gambar Produk"
                    placeholder="Gambar Produk"
                    lableRequired
                />

                <FormInput<ProductFormValues>
                    errors={form.formState.errors}
                    name="description"
                    register={form.register}
                    type="textarea"
                    label="Deskripsi Produk"
                    placeholder="Deskripsi Produk ..."
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Simpan Produk</button>
                </div>
            </form>
        </div>
    )
}

export default ProductForm;
