import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    tagTypes: [],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.IS_DEV ? `${process.env.BASE_URL}/api` : '/api', // `${process.env.BASE_URL}/api`, // process.env.NODE_ENV !== 'dev' ? '/api' : `${process.env.BASE_URL}/api`
    }),
    endpoints: (builder) => ({
        getCars: builder.query<any, any>({
            query: (params) => ({ method: 'GET', url: '/cars', params })
        }),
        getCarById: builder.query<any, {id: string, userId?: string}>({
            query: ({id, userId}) => ({ method: 'GET', url: `/cars/${id}`, params: {userId} })
        }),
        getModels: builder.query<any, any>({
            query: (params) => ({ method: 'GET', url: '/models', params })
        }),
        getBrands: builder.query<any, any>({
            query: (params) => ({ method: 'GET', url: '/brands', params })
        }),
    })
})

export const {useGetCarsQuery, useGetBrandsQuery, useGetCarByIdQuery, useGetModelsQuery} = api;