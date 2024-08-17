import {Button, Drawer, InputNumber, Select, Space, Spin} from "antd";
import {LeftOutlined} from "@ant-design/icons";
import React, {useEffect, useMemo, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useGetBrandsQuery, useGetCarsCountQuery, useGetCarsQuery, useGetModelsQuery} from "../api.tsx";

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

const t = (str: string | null) => {
    if (!str) {
        return {
            sort: undefined,
            order: undefined,
        }
    }

    const [sort, order] = str.split('&');
    return {
        sort: sort.split('=')[1],
        order: order.split('=')[1],
    }
}

const CarsListPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    const drawer = searchParams.get('drawer');
    const priceFrom = searchParams.get('priceFrom');
    const priceTo = searchParams.get('priceTo');
    const mileageFrom = searchParams.get('mileageFrom');
    const mileageTo = searchParams.get('mileageTo');
    const yearFrom = searchParams.get('yearFrom');
    const yearTo = searchParams.get('yearTo');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page') || '1';
    const {sort: ssort, order} = t(sort);

    let userId = searchParams.get('userId');
    if (window.Telegram?.WebApp?.initDataUnsafe) {
        userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
    }

    const {data, isFetching: isCarLoading, refresh} = useGetCarsQuery({
        brand,
        model,
        priceTo,
        priceFrom,
        mileageFrom,
        mileageTo,
        yearFrom,
        yearTo,
        sort: ssort,
        order,
        page,
        userId
    });
    const {data: brandsData, isLoading: isBrandsLoading} = useGetBrandsQuery({});
    const {data: modelsData, isLoading: isModelsLoading} = useGetModelsQuery({brand});

    const cars = data?.items || [];
    const resultPage = data?.page || 0;

    const [combineResult, setCombineResult] = useState<[]>([]);

    useEffect(() => {
        setCombineResult(prevState => prevState.concat(cars));
    }, [resultPage]);

    const brands = brandsData || [];
    const models = useMemo(() => (modelsData || []).map(m => m.items ? m.items : [m]).flat(), [modelsData]);

    const showDrawer = () => {
        searchParams.set('drawer', brand ? 'model' : 'brand');
        setSearchParams(searchParams)
    };

    const onClose = () => {
        searchParams.delete('drawer');
        setSearchParams(searchParams)
    };

    const onSelectCar = (id: string) => {
        navigate(id);
    };

    const clearModel = () => {
        searchParams.set('drawer', 'brand');
        searchParams.delete('model');
        setSearchParams(searchParams);
        refresh();
    }

    const onSelectBrand = (brandKey: string) => {
        searchParams.set('page', '1');
        searchParams.set('brand', brandKey);
        searchParams.set('drawer', 'model');
        setSearchParams(searchParams)
        refresh();
    }

    const onSelectModel = (brandKey: string) => {
        searchParams.set('page', '1');
        searchParams.set('model', brandKey);
        searchParams.delete('drawer');
        setSearchParams(searchParams)
        refresh();
    }
    const [{_priceFrom, _priceTo, _mileageFrom, _mileageTo, _yearFrom, _yearTo}, setParams] = useState({
        _priceFrom: priceFrom || '',
        _priceTo: priceTo || '',
        _mileageFrom: mileageFrom || '',
        _mileageTo: mileageTo || '',
        _yearFrom: yearFrom || '',
        _yearTo: yearTo || ''
    })

    const {data: countData} = useGetCarsCountQuery({
        priceFrom: _priceFrom,
        priceTo: _priceTo,
        mileageFrom: _mileageFrom,
        mileageTo: _mileageTo,
        yearFrom: _yearFrom,
        yearTo: _yearTo,
        brand,
        model
    })

    const docElements = document.getElementsByClassName("car-item-container");

    let currentPage = true;

    useEffect(() => {
        currentPage = false;
    }, [cars]);

    window.addEventListener(
        "scroll",
        function (event) {
            try {
                const lastEl =
                    docElements[0]?.children[docElements[0]?.children?.length - 1]
                        ?.offsetTop - 2000;
                const windowPageYOffset = window.pageYOffset;

                if (windowPageYOffset >= lastEl && !isCarLoading && !currentPage) {
                    currentPage = true;

                    if (cars.length >= 20) {
                        const prevOffset = 1 + Number(page);
                        searchParams.set("page", prevOffset.toString());
                        setSearchParams(searchParams)
                    }
                }
            } catch (e) {
                console.log("e =", e);
            }
        },
        false,
    );

    const showCount = countData?.count || 0;

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
        searchParams.set('page', '1');
        searchParams.delete('drawer');
        setSearchParams(searchParams);
    }

    const sortOptions = [
        {label: 'По умолчанию', value: 'sort=rel&order=asc'},
        {label: 'Цена по убыванию', value: 'sort=p&order=desc'},
        {label: 'Цена по возрастанию', value: 'sort=p&order=asc'},
        {label: 'Пробег по убыванию', value: 'sort=ml&order=desc'},
        {label: 'Пробег по возрастанию', value: 'sort=ml&order=asc'},
        {label: 'Год по убыванию', value: 'sort=fr&order=desc'},
        {label: 'Год по возрастанию', value: 'sort=fr&order=asc'},
    ]

    const openFilters = () => {
        searchParams.set('drawer', 'filters');
        setSearchParams(searchParams)
    }

    const onChangeSort = (value: string) => {
        searchParams.set('sort', value);
        setSearchParams(searchParams)
    }

    return <>
        <div className="car-item-container">
            {/*<List data={combineResult} styles={virtualListStyles} height={500} itemHeight={314} itemKey="id">*/}
            {/*    {(car =>*/}
            {/*        <div onClick={() => onSelectCar(car.id)} className="car-item" key={car.id}>*/}
            {/*            {car.imgUrls[0] && <img src={car.imgUrls[0].replace('mo-160', 'mo-360')}*/}
            {/*                                    style={{width: '360px'}}*/}
            {/*                                    alt=""/>}*/}
            {/*            <div className="details">*/}
            {/*                <div className="price">{moneyFormat(car.price, 0, 0)}</div>*/}
            {/*                <span className="title">{car.title}</span>*/}
            {/*                /!*<div className="date">{car.date}</div>*!/*/}
            {/*                /!*<h4>Пробег</h4>*!/*/}
            {/*                <div className="mileage">{car.date.split('/')[1]} г., {shortNumberFormat(car.mileage)} км*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>)}*/}
            {/*</List>*/}
            {combineResult.map(car => <div onClick={() => onSelectCar(car.id)} className="car-item"
                                           key={car.id}>
                {car.imgUrls[0] && <img src={car.imgUrls[0].replace('mo-160', 'mo-360')}
                                        style={{width: '360px'}}
                                        alt=""/>}
                <div className="details">
                    <div className="price">{moneyFormat(car.price, 0, 0)}</div>
                    <span className="title">{car.title}</span>
                    {/*<div className="date">{car.date}</div>*/}
                    {/*<h4>Пробег</h4>*/}
                    <div className="mileage">{car.date.split('/')[1]} г., {shortNumberFormat(car.mileage)} км</div>
                </div>
            </div>)}
            {isCarLoading && <Spin/>}
        </div>
        <div style={{
            width: '100%',
            position: 'fixed',
            bottom: 16,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Button type="primary" size="large" onClick={openFilters}
                    style={{margin: 'auto'}}>Найдено {showCount} предложений</Button>
        </div>
        <Drawer
            title="Фильтры"
            placement="bottom"
            onClose={onClose}
            open={drawer === 'filters'}
            contentWrapperStyle={{maxHeight: '300px'}}
        >
            <div className="filters">
                <Space>
                    <Button onClick={showDrawer}>
                        Марка, модель
                    </Button>
                    <Space.Compact size="large">
                        <InputNumber type="number" placeholder="Цена от" size="middle" value={_priceFrom}
                                     className="full-width"
                                     onChange={onChangeParams('_priceFrom')}/>
                        <InputNumber type="number" placeholder="Цена до" size="middle" value={_priceTo}
                                     className="full-width"
                                     onChange={onChangeParams('_priceTo')}/>
                    </Space.Compact>
                </Space>
                <Space.Compact size="large">
                    <InputNumber type="number" placeholder="Пробег от" size="middle" value={_mileageFrom}
                                 className="full-width"
                                 onChange={onChangeParams('_mileageFrom')}/>
                    <InputNumber type="number" placeholder="Пробег до" size="middle" value={_mileageTo}
                                 className="full-width"
                                 onChange={onChangeParams('_mileageTo')}/>
                </Space.Compact>
                <Space.Compact size="large">
                    <InputNumber type="number" placeholder="Год от" size="middle" value={_yearFrom}
                                 className="full-width"
                                 onChange={onChangeParams('_yearFrom')}/>
                    <InputNumber type="number" placeholder="Год до" size="middle" value={_yearTo} className="full-width"
                                 onChange={onChangeParams('_yearTo')}/>
                </Space.Compact>
                <Select placeholder="Сортировать по умолчанию" onChange={onChangeSort} options={sortOptions}/>
                <Button type="primary" onClick={acceptPrice}>
                    Показать {showCount} предложений
                </Button>
            </div>
        </Drawer>
        <Drawer
            title="Марки"
            placement="bottom"
            onClose={onClose}
            open={drawer === 'brand'}
        >
            {isBrandsLoading && <Spin/>}
            {!isBrandsLoading && brands.map(brand => <div className="list-item" key={brand.value}
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
            {isModelsLoading && <Spin/>}
            {!isModelsLoading && models.map(brand => <div className="list-item" key={brand.value}
                                                          onClick={() => onSelectModel(brand.value)}>{brand.label}</div>)}
        </Drawer>
    </>
}

export default CarsListPage;