import {useGetCarByIdQuery} from "../../api.tsx";
import {useParams, useSearchParams} from "react-router-dom";
import {Button, Carousel, Spin} from "antd";
import React from "react";
import {LeftOutlined} from "@ant-design/icons";
import './CarDetailsPage.less'
import {moneyFormat} from "../../utils.ts";

const Container = ({children}) => <div className="container CarDetailsPage">
        <div className="PageContainer">
            <Button icon={<LeftOutlined/>} style={{margin: '16px 0 0'}} type="link" size="large"
                    onClick={() => window.history.back()}/>
            {children}
        </div>
    </div>

const CarDetailsPage = () => {
    const {id} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    let userId = searchParams.get('userId');
    if (window.Telegram?.WebApp?.initDataUnsafe) {
        userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
    }

    const {data, isFetching, isError, refetch} = useGetCarByIdQuery({userId, id}, {
        skip: !id
    });

    const technical = data?.attributes || [];
    const features = data?.features || [];

    if(isFetching){
    return <Container>
            <Spin style={{width: '100%', height: '100%'}}/>
        </Container>
    }

    if(isError) {
    return <Container>
            <Button onClick={refetch} style={{margin: 'auto'}} type="primary">Обновить</Button>
        </Container>
    }

    return <Container>
            <h1 className="PageCard__title">{data?.title}</h1>
            <div className="CardPriceNew-">
                <span className="CardPriceNew__price">{moneyFormat(data?.price, 0, 0)}</span>
                <div className="CardPriceNew__rowSecondary">({moneyFormat(data?.priceWithoutVAT, 0, 0)} без VAT)</div>
            </div>
            <Carousel className="OfferGallery">
                {data?.imgUrls.map(img => <img src={img.replace('mo-160', 'mo-360')}
                                               style={{width: '360px'}}
                                               alt=""/>)}
            </Carousel>
            <h2>Характеристики</h2>
            {technical.map(item => <div className="labelValue" key={item.key}>
                <div className="label">{item.label}</div>
                <div className="value">{item.value}</div>
            </div>)}
            <h2>Комплектация</h2>
            {features.map(item => <div className="features__name" key={item.value}><span
                className="catalog-option__name">{item.label}</span>
            </div>)}
        </Container>
}

export default CarDetailsPage
