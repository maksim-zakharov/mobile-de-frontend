import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    tagTypes: [],
    baseQuery: fetchBaseQuery(),
    endpoints: (builder) => ({
        getCars: builder.query<any, any>({
            query: (params) => ({ method: 'GET', url: '/cars', params })
        }),
    })
})

export const {useGetCarsQuery} = api;