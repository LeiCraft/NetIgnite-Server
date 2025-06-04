import type { FetchError } from 'ofetch';
import type { NitroFetchRequest, AvailableRouterMethod as _AvailableRouterMethod } from 'nitropack';
import type { Ref } from 'vue';
import type { DefaultAsyncDataErrorValue, DefaultAsyncDataValue } from 'nuxt/app/defaults';
import type { _AsyncData, KeysOf, PickFrom } from "@/node_modules/nuxt/dist/app/composables/asyncData.js";
import type { FetchResult, UseFetchOptions } from '#app';

type AvailableRouterMethod<R extends NitroFetchRequest> = Uppercase<_AvailableRouterMethod<R>>;

// declare function useFetch<
//     ResT = void,
//     ErrorT = FetchError,
//     ReqT extends NitroFetchRequest = NitroFetchRequest,
//     Method extends AvailableRouterMethod<ReqT> = ResT extends void ? 'get' extends AvailableRouterMethod<ReqT> ? 'get' : AvailableRouterMethod<ReqT> : AvailableRouterMethod<ReqT>,
//     _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
//     DataT = _ResT,
//     PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
//     DefaultT = DefaultAsyncDataValue
// >(request: Ref<ReqT> | ReqT | (() => ReqT), opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>): AsyncData<
//     PickFrom<DataT, PickKeys> | DefaultT, ErrorT | DefaultAsyncDataErrorValue
// >;

// declare function useFetch<
//     ResT = void,
//     ErrorT = FetchError,
//     ReqT extends NitroFetchRequest = NitroFetchRequest,
//     Method extends AvailableRouterMethod<ReqT> = ResT extends void ? 'get' extends AvailableRouterMethod<ReqT> ? 'get' : AvailableRouterMethod<ReqT> : AvailableRouterMethod<ReqT>,
//     _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
//     DataT = _ResT,
//     PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
//     DefaultT = DataT
// >(request: Ref<ReqT> | ReqT | (() => ReqT), opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>): AsyncData<
//     PickFrom<DataT, PickKeys> | DefaultT, ErrorT | DefaultAsyncDataErrorValue
// >;


type FetchResponseData<DataT, PickKeys extends KeysOf<DataT>, DefaultT, ErrorT> = NonNullable<_AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | DefaultAsyncDataErrorValue>["data"]["value"]>;

export type APIResponse<DataT, PickKeys extends KeysOf<DataT>, DefaultT, ErrorT, ResData = FetchResponseData<DataT, PickKeys, DefaultT, ErrorT>> = {
    status: "ERROR";
    message: string;
    data: undefined;
    // @ts-ignore
} | ResData;


export function useAPI<
    ResT = void,
    ErrorT = FetchError,
    ReqT extends NitroFetchRequest = NitroFetchRequest,
    Method extends AvailableRouterMethod<ReqT> = ResT extends void ? 'GET' extends AvailableRouterMethod<ReqT> ? 'GET' : AvailableRouterMethod<ReqT> : AvailableRouterMethod<ReqT>,
    _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
    DataT = _ResT,
    PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
    DefaultT = DefaultAsyncDataValue
>(
    request: Ref<ReqT> | ReqT | (() => ReqT),
    opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>,
    disableAuthRedirect?: boolean
): Promise<APIResponse<DataT, PickKeys, DefaultT, ErrorT>>;

export function useAPI<
    ResT = void,
    ErrorT = FetchError,
    ReqT extends NitroFetchRequest = NitroFetchRequest,
    Method extends AvailableRouterMethod<ReqT> = ResT extends void ? 'GET' extends AvailableRouterMethod<ReqT> ? 'GET' : AvailableRouterMethod<ReqT> : AvailableRouterMethod<ReqT>,
    _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
    DataT = _ResT,
    PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
    DefaultT = DataT
>(
    request: Ref<ReqT> | ReqT | (() => ReqT),
    opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>,
    disableAuthRedirect?: boolean
): Promise<APIResponse<DataT, PickKeys, DefaultT, ErrorT>>;

export async function useAPI(
    request: Parameters<typeof useFetch>[0],
    opts?: Parameters<typeof useFetch>[1],
    disableAuthRedirect = false
) {
    
    try {
        let data: APIResponse<any, any, any, any>;

        if (import.meta.server) {
            data = (await useFetch(request, { ignoreResponseError: true, ...opts })).data?.value;
        } else {

            let requestValue = request as NitroFetchRequest;
            if (typeof request === 'function') {
                requestValue = request();
            } else if (isRef(request)) {
                requestValue = request.value;
            }

            data = (await $fetch(requestValue, { ignoreResponseError: true, ...opts } as any));
        }
        

        if (data) {
            if (import.meta.client && !disableAuthRedirect &&
                data.status === "ERROR" && (data.message === "No session found" || data.message === "Invalid session")
            ) {
                navigateTo('/auth/login?url=' + encodeURIComponent(useRoute().fullPath));
            }
            return data;
        }

    } catch (error) {
        console.error("API Error:", error);
    }

    return {
        status: "ERROR",
        message: "An error occurred while fetching the API data."
    }

}

