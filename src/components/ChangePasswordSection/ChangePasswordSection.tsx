import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from 'yup';
import { getAuthClient } from "../../api/grpc/client";
import useGrpcApi from "../../hooks/useGrpcApi";
import FormInput from "../FormInput/FormInput";

const changePasswordSchema = yup.object().shape({
    current_password: yup.string().required('Kata sandi saat ini wajid diisi'),
    new_password: yup.string().required('Kata sandi baru wajib diisi').min(6, 'Kata sandi baru minimal 6 karakter'),
    confirm_new_password: yup.string().required('Konfirmasi kata sandi wajib diisi').oneOf([yup.ref('new_password')], 'Konfirmasi kata sandi baru harus sesuai'),
})

interface ChangePasswordFormValues{
    current_password: string;
    new_password: string;
    confirm_new_password: string;
}

function ChangePasswordSection() {
    const submitApi = useGrpcApi();
    const form = useForm<ChangePasswordFormValues>({
        resolver: yupResolver(changePasswordSchema)
    })

    const submitHandler = async (values: ChangePasswordFormValues) => {
        await submitApi.callApi(getAuthClient().changePassword({
            newPassword: values.new_password,
            newPasswordConfirmation: values.confirm_new_password,
            oldPassword: values.current_password,
        }),{
            defaultError: (resp) => {
            if (resp.response.base?.message === "old password is not matched"){
                Swal.fire({
                    icon: 'error',
                    title: 'Ganti Password Gagal',
                    text: 'Kata sandi lama salah'
                });
                }
            },
            useDefaultError: false
        });
            

        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Terjadi Kesalahan',
        //         text: 'Silahkan coba beberapa saat lagi.'
        //     })

        //     return

        Swal.fire({
            icon: 'success',
            title: 'Ganti Password Sukses',
        })
        form.reset()
        return
    }
    return (
        <div className="p-4 p-lg-5 border bg-white">
            <h2 className="h3 mb-3 text-black">Ubah Kata Sandi</h2>
            <form action="" onSubmit={form.handleSubmit(submitHandler)}>

                <FormInput<ChangePasswordFormValues>
                    errors = {form.formState.errors}
                    name="current_password"
                    register={form.register}
                    type="password"
                    label="Kata Sandi Saat Ini"
                    disabled={submitApi.isLoading}
                />

                <FormInput<ChangePasswordFormValues>
                    errors = {form.formState.errors}
                    name="new_password"
                    register={form.register}
                    type="password"
                    label="Kata Sandi Baru"
                    disabled={submitApi.isLoading}
                />

                <FormInput<ChangePasswordFormValues>
                    errors = {form.formState.errors}
                    name="confirm_new_password"
                    register={form.register}
                    type="password"
                    label="Konfirmasi Kata Sandi Baru"
                    disabled={submitApi.isLoading}
                />

                <button type="submit" disabled={submitApi.isLoading} className="btn btn-primary">Perbarui Kata Sandi</button>
            </form>
        </div>
    )
}

export default ChangePasswordSection;
