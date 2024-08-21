import {createApi, fetchBaseQuery, retry} from '@reduxjs/toolkit/query/react'
import queryString from 'query-string';

export const api = createApi({
    reducerPath: 'api',
    tagTypes: [],
    baseQuery: retry(fetchBaseQuery({
        baseUrl: process.env.IS_DEV ? '/api' : `${process.env.BASE_URL}/api`, // `${process.env.BASE_URL}/api`, // process.env.NODE_ENV !== 'dev' ? '/api' : `${process.env.BASE_URL}/api`
        paramsSerializer: (params: Record<string, unknown>) => queryString.stringify(params, {arrayFormat: 'none'}),
        // signal: controller.signal
    })),
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