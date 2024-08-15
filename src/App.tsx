import React, {useState} from 'react'
import './App.css'
import {useGetBrandsQuery, useGetCarsQuery, useGetModelsQuery} from "./api";
import {Button, Carousel, Drawer} from "antd";
import {useSearchParams} from "react-router-dom";
import {LeftOutlined} from "@ant-design/icons"

export const moneyFormat = (money: number, maximumFractionDigits = undefined, minimumFractionDigits = undefined) =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits,
        minimumFractionDigits
    }).format(money);

export const shortNumberFormat = (number: number, minimumFractionDigits = undefined, maximumFractionDigits = 1) =>
    Intl.NumberFormat('ru-RU', {
        // notation: 'compact',
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(number || 0);

function App() {

    const [searchParams, setSearchParams] = useSearchParams();

    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    const drawer = searchParams.get('drawer');

    const {data} = useGetCarsQuery({brand, model});
    const {data: brandsData} = useGetBrandsQuery({});
    const {data: modelsData} = useGetModelsQuery({brand});

    const cars = data?.items || [];
    const brands = brandsData || [];
    const models = modelsData || [];

    const showDrawer = () => {
        searchParams.set('drawer', brand ? 'model' : 'brand');
        setSearchParams(searchParams)
    };

    const onClose = () => {
        searchParams.delete('drawer');
        setSearchParams(searchParams)
    };

    const clearModel = () => {
        searchParams.set('drawer', 'brand');
        searchParams.delete('model');
        setSearchParams(searchParams)
    }

    const onSelectBrand = (brandKey: string) => {
        searchParams.set('brand', brandKey);
        searchParams.set('drawer', 'model');
        setSearchParams(searchParams)
    }

    const onSelectModel = (brandKey: string) => {
        searchParams.set('model', brandKey);
        searchParams.delete('drawer');
        setSearchParams(searchParams)
    }

    return (
        <>
            <div className="filters">
                <Button onClick={showDrawer}>
                    Марка, модель
                </Button>
            </div>
            <div className="car-item-container">
                {cars.map(car => <div className="car-item">
                    {/*<h4>Описание</h4>*/}
                    {/*<p className="details">{car.detailsText}</p>*/}
                    <Carousel>
                        {car.imgUrls.map(imgUrl => <img src={imgUrl.replace('mo-160', 'mo-360')}
                                                        style={{width: '360px'}}
                                                        alt=""/>)}
                    </Carousel>
                    <div className="details">
                        <div className="price">{moneyFormat(car.price, 0, 0)}</div>
                        <span className="title">{car.title}</span>
                        {/*<div className="date">{car.date}</div>*/}
                        {/*<h4>Пробег</h4>*/}
                        <div className="mileage">{car.date.split('/')[1]} г., {shortNumberFormat(car.mileage)} км</div>
                    </div>
                </div>)}
            </div>
            <Drawer
                title="Марки"
                placement="bottom"
                onClose={onClose}
                open={drawer === 'brand'}
            >
                {brands.map(brand => <div className="list-item" key={brand.value}
                                          onClick={() => onSelectBrand(brand.value)}>{brand.label}</div>)}
            </Drawer>
            <Drawer
                title="Модели"
                placement="bottom"
                onClose={onClose}
                open={drawer === 'model'}
            >
                <Button type="link" icon={<LeftOutlined/>} onClick={clearModel} style={{padding: 0}}>
                    Выбрать другую марку
                </Button>
                {models.map(brand => <div className="list-item" key={brand.value}
                                          onClick={() => onSelectModel(brand.value)}>{brand.label}</div>)}
            </Drawer>
        </>
    )
}

export default App
