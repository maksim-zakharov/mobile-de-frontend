import React, {useState} from 'react'
import './App.css'
import {useGetBrandsQuery, useGetCarsQuery, useGetModelsQuery} from "./api";
import {Button, Carousel, Drawer, InputNumber, Space} from "antd";
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
    const priceFrom = searchParams.get('priceFrom');
    const priceTo = searchParams.get('priceTo');
    const mileageFrom = searchParams.get('mileageFrom');
    const mileageTo = searchParams.get('mileageTo');
    const yearFrom = searchParams.get('yearFrom');
    const yearTo = searchParams.get('yearTo');

    const {data} = useGetCarsQuery({brand, model, priceTo, priceFrom, mileageFrom, mileageTo, yearFrom, yearTo});
    const {data: brandsData} = useGetBrandsQuery({});
    const {data: modelsData} = useGetModelsQuery({brand});

    const cars = data?.items || [];
    const carsTotal = data?.totalCount || 0;
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
    const [{_priceFrom, _priceTo, _mileageFrom, _mileageTo, _yearFrom, _yearTo}, setParams] = useState({
        _priceFrom: priceFrom || '',
        _priceTo: priceTo || '',
        _mileageFrom: mileageFrom || '',
        _mileageTo: mileageTo || '',
        _yearFrom: yearFrom || '',
        _yearTo: yearTo || ''
    })

    const onChangeParams = (key: string) => (e) => {
        setParams(prevState => ({...prevState, [key]: e}));
    }

    const acceptPrice = () => {
        searchParams.set('priceFrom', _priceFrom);
        searchParams.set('priceTo', _priceTo);
        searchParams.set('mileageFrom', _mileageFrom);
        searchParams.set('mileageTo', _mileageTo);
        searchParams.set('yearFrom', _yearFrom);
        searchParams.set('yearTo', _yearTo);
        setSearchParams(searchParams)
    }

    return (
        <>
            <div className="filters">
                <Space>
                    <Button onClick={showDrawer}>
                        Марка, модель
                    </Button>
                    <Space.Compact size="large">
                        <InputNumber type="number" placeholder="Цена от" size="middle" value={_priceFrom}
                                     onChange={onChangeParams('_priceFrom')}/>
                        <InputNumber type="number" placeholder="Цена до" size="middle" value={_priceTo}
                                     onChange={onChangeParams('_priceTo')}/>
                    </Space.Compact>
                </Space>
                <Space.Compact size="large">
                    <InputNumber type="number" placeholder="Пробег от" size="middle" value={_mileageFrom}
                                 onChange={onChangeParams('_mileageFrom')}/>
                    <InputNumber type="number" placeholder="Пробег до" size="middle" value={_mileageTo}
                                 onChange={onChangeParams('_mileageTo')}/>
                </Space.Compact>
                <Space.Compact size="large">
                    <InputNumber type="number" placeholder="Год от" size="middle" value={_yearFrom}
                                 onChange={onChangeParams('_yearFrom')}/>
                    <InputNumber type="number" placeholder="Год до" size="middle" value={_yearTo}
                                 onChange={onChangeParams('_yearTo')}/>
                </Space.Compact>
                <Button onClick={acceptPrice}>
                    Показать {carsTotal} предложений
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
