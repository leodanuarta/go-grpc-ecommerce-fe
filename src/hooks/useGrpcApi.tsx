import { FinishedUnaryCall, RpcError, type UnaryCall } from "@protobuf-ts/runtime-rpc";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BaseResponse } from "../../pb/common/base_response";
import { useAuthStore } from "../store/auth";

interface GrpcBaseResponse{
  base?: BaseResponse;
}

interface CallApiArgs<T extends object, U extends GrpcBaseResponse>{
  useDefaultError?: boolean;
  defaultError?:(e: FinishedUnaryCall<T, U>) => void;
  useDefaultAuthError?: boolean;
  defaultAuthError?: (e: RpcError) => void;
}

function useGrpcApi() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const logoutUser = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  

  const callApi = async <T extends object, U extends GrpcBaseResponse> (
    api: UnaryCall<T, U>,
    args?: CallApiArgs<T,U>
  ) => {
    try {
      setIsLoading(true);

      const res = await api;

      if (res.response.base?.isError ?? true){
        throw res;
      }

      return res
    }catch(e){
      if (e instanceof RpcError){
        if (e.code === "UNAUTHENTICATED"){
          if (args?.useDefaultAuthError ?? true){
            logoutUser();
            localStorage.removeItem('access_token');
            Swal.fire({
                icon: 'warning',
                title: 'Sesi Telah Berakhir',
                text: 'Silahkan login ulang kembali',
                confirmButtonText: 'OK',
            })
            navigate('/login')
          }

          if (args?.useDefaultAuthError === false && args.defaultAuthError){
            args.defaultAuthError(e)
          }
            throw e
        }
      }
        if (typeof e === "object" && e !== null && "response" in e && args?.useDefaultError === false){
          if (args?.defaultError){
            args.defaultError(e as FinishedUnaryCall<T, U>)
          }
        }

        if (args?.useDefaultError ?? true){
          Swal.fire({
              icon: 'error',
              title: 'Terjadi Kesalahan',
              text: 'Silahkan coba beberapa saat lagi',
              confirmButtonText: 'OK',
          })
        }
        
        throw e
    }finally{
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    callApi,
  }
}

export default useGrpcApi