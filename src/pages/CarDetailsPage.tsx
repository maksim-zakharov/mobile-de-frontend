import {useGetCarByIdQuery} from "../api.tsx";
import {useParams, useSearchParams} from "react-router-dom";
import {Button, Spin} from "antd";
import React from "react";

const CarDetailsPage = () => {
    const {id} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    let userId = searchParams.get('userId');
    if(window.Telegram?.WebApp?.initDataUnsafe){
        userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
    }

    const {data, isFetching, isError, refetch} = useGetCarByIdQuery({userId, id}, {
        skip: !id
    });

    const technical = data?.technicalData || [];

    return <div className="container">
        <h2>Характеристики</h2>
        {isFetching && <Spin style={{width:'100%',height:'100%'}}/>}
        {isError && <Button onClick={refetch} style={{    margin: 'auto'}} type="primary">Обновить</Button>}
        {technical.map(item => <div className="labelValue" key={item.key}>
            <div className="label">{item.label}</div>
            <div className="value">{item.value}</div>
        </div>)}
    </div>
}

export default CarDetailsPage