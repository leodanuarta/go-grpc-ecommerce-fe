import { RpcInterceptor } from "@protobuf-ts/runtime-rpc";

export const authIntercepter: RpcInterceptor = {
  interceptUnary(next, method, input, options) {
    const accessToken = localStorage.getItem('access_token');
    
    options.meta = {
      ...options.meta,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    }

    return next(method, input, options);
  },
}

