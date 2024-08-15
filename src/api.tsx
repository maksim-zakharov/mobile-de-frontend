import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    tagTypes: [],
    baseQuery: fetchBaseQuery({
        baseUrl: '/api', // `${process.env.BASE_URL}/api`, // process.env.NODE_ENV !== 'dev' ? '/api' : `${process.env.BASE_URL}/api`
    }),
    endpoints: (builder) => ({
        getCars: builder.query<any, any>({
            query: (params) => ({ method: 'GET', url: '/cars', params })
        }),
        getModels: builder.query<any, any>({
            query: (params) => ({ method: 'GET', url: '/models', params })
        }),
        getBrands: builder.query<any, any>({
            query: (params) => ({ method: 'GET', url: '/brands', params })
        }),
    })
})

export const {useGetCarsQuery, useGetBrandsQuery, useGetModelsQuery} = api;