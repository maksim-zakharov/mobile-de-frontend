import {BaseQueryApi, createApi, fetchBaseQuery, retry} from '@reduxjs/toolkit/query/react'
import queryString from 'query-string';

const urlRequests: {[url: string]: any} = {};
const controller = new AbortController();
controller.signal.onabort = console.log;

export const baseQueryWithRepeat = async (args, api: BaseQueryApi, extraOptions) => {

    if(!urlRequests[args.url]){
        urlRequests[args.url] = args;
    } else {
        controller.abort('change params')
        console.log('aborted')
        delete urlRequests[args.url]
    }

    const result = await retry(fetchBaseQuery({
        baseUrl: process.env.IS_DEV ? `${process.env.BASE_URL}/api` : '/api', // `${process.env.BASE_URL}/api`, // process.env.NODE_ENV !== 'dev' ? '/api' : `${process.env.BASE_URL}/api`
        paramsSerializer: (params: Record<string, unknown>) => queryString.stringify(params, {arrayFormat: 'none'}),
        // signal: controller.signal
    }), {
        maxRetries: 5,
    })(args, api, extraOptions);

    delete urlRequests[args.url]

    return result;
};

export const api = createApi({
    reducerPath: 'api',
    tagTypes: [],
    baseQuery: baseQueryWithRepeat,
    endpoints: (builder) => ({
        getCars: builder.query<any, any>({
            query: (params) => ({method: 'GET', url: '/cars', params}),
        }),
        getCarsCount: builder.query<any, any>({
            query: (params) => ({method: 'GET', url: '/cars/count', params})
        }),
        getCarById: builder.query<any, { id: string, userId?: string }>({
            query: ({id, userId}) => ({method: 'GET', url: `/cars/${id}`, params: {userId}})
        }),
        getModels: builder.query<any, any>({
            query: (params) => ({method: 'GET', url: '/models', params})
        }),
        getBrands: builder.query<any, any>({
            query: (params) => ({method: 'GET', url: '/brands', params})
        }),
    })
})

export const {useGetCarsQuery, useGetBrandsQuery, useGetCarsCountQuery, useGetCarByIdQuery, useGetModelsQuery} = api;