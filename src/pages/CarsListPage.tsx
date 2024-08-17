import {Button, Drawer, Select, SelectProps, Space, Spin} from "antd";
import {LeftOutlined} from "@ant-design/icons";
import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
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

const MobileSelect: FC<SelectProps> = (props) => {

    // const id = useId();
    // const ref = createRef();
    // const onFocus = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     ref?.current?.focus();
    // }

    return <>
        <select
            // id={id}
            // ref={ref}
            // hidden
            value={props.value}
            onChange={e => props?.onChange(e.target.value)}>
            {props.options?.map(opt => <option value={opt.value}>{opt.label}</option>)}
        </select>
    </>
}

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
    const pwFrom = searchParams.get('pwFrom');
    const pwTo = searchParams.get('pwTo');
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

    const {data, isFetching: isCarLoading, refetch} = useGetCarsQuery({
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
        pwFrom,
        pwTo,
        userId
    });
    const {data: brandsData, isLoading: isBrandsLoading} = useGetBrandsQuery({});
    const {data: modelsData, isLoading: isModelsLoading} = useGetModelsQuery({brand});

    const cars = data?.items || [];

    const [combineResult, setCombineResult] = useState<[]>([]);

    useEffect(() => {
        if (!isCarLoading)
            setCombineResult(prevState => prevState.concat(cars));
    }, [isCarLoading]);

    const brands = brandsData || [];
    const models = useMemo(() => (modelsData || []).map(m => m.items ? m.items : [m]).flat(), [modelsData]);

    const selectedBrand = useMemo(() => brands.find(b => b.value === brand), [brand, brands])
    const selectedModel = useMemo(() => models.find(b => b.value === model), [model, models])

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
        setCombineResult([]);
        searchParams.set('drawer', 'brand');
        searchParams.delete('model');
        setSearchParams(searchParams);
        refetch();
    }

    const onSelectBrand = (brandKey: string) => {
        setCombineResult([]);
        searchParams.set('page', '1');
        searchParams.set('brand', brandKey);
        searchParams.set('drawer', 'model');
        setSearchParams(searchParams)
        refetch();
    }

    const onSelectModel = (brandKey: string) => {
        setCombineResult([]);
        searchParams.set('page', '1');
        searchParams.set('model', brandKey);
        searchParams.set('drawer', 'filters');
        setSearchParams(searchParams)
        refetch();
    }

    const clearFilters = () => {
        Array.from(searchParams.keys()).forEach(key => searchParams.delete(key));
        setSearchParams(searchParams);
        setParams({
            _pwFrom: pwFrom || '',
            _pwTo: pwTo || '',
            _priceFrom: priceFrom || '',
            _priceTo: priceTo || '',
            _mileageFrom: mileageFrom || '',
            _mileageTo: mileageTo || '',
            _yearFrom: yearFrom || '',
            _yearTo: yearTo || ''
        })
    }

    const [{_pwFrom, _pwTo, _priceFrom, _priceTo, _mileageFrom, _mileageTo, _yearFrom, _yearTo}, setParams] = useState({
        _pwFrom: pwFrom || '',
        _pwTo: pwTo || '',
        _priceFrom: priceFrom || '',
        _priceTo: priceTo || '',
        _mileageFrom: mileageFrom || '',
        _mileageTo: mileageTo || '',
        _yearFrom: yearFrom || '',
        _yearTo: yearTo || ''
    })

    const {data: countData, isFetching: isCountFetching} = useGetCarsCountQuery({
        priceFrom: _priceFrom,
        priceTo: _priceTo,
        mileageFrom: _mileageFrom,
        mileageTo: _mileageTo,
        yearFrom: _yearFrom,
        yearTo: _yearTo,
        pwFrom: _pwFrom,
        pwTo: _pwTo,
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
        setCombineResult([]);
        searchParams.set('pwFrom', _pwFrom);
        searchParams.set('pwTo', _pwTo);
        searchParams.set('priceFrom', _priceFrom);
        searchParams.set('priceTo', _priceTo);
        searchParams.set('mileageFrom', _mileageFrom);
        searchParams.set('mileageTo', _mileageTo);
        searchParams.set('yearFrom', _yearFrom);
        searchParams.set('yearTo', _yearTo);
        searchParams.set('page', '1');
        searchParams.delete('drawer');
        setSearchParams(searchParams);
        refetch()
    }

    const openFilters = () => {
        searchParams.set('drawer', 'filters');
        setSearchParams(searchParams)
    }

    const onChangeSort = (value: string) => {
        searchParams.set('sort', value);
        setSearchParams(searchParams)
    }

    const sortOptions = useCallback((label: string) => [{
        label,
        value: 'sort=rel&order=asc'
    }, ...[
        // {label: 'По умолчанию', value: 'sort=rel&order=asc'},
        {label: 'Цена по убыванию', value: 'sort=p&order=desc'},
        {label: 'Цена по возрастанию', value: 'sort=p&order=asc'},
        {label: 'Пробег по убыванию', value: 'sort=ml&order=desc'},
        {label: 'Пробег по возрастанию', value: 'sort=ml&order=asc'},
        {label: 'Год по убыванию', value: 'sort=fr&order=desc'},
        {label: 'Год по возрастанию', value: 'sort=fr&order=asc'},
    ]], [])

    const priceOptions = useCallback((label: string) => [{
        label,
        value: ''
    }, ...Array.apply(null, {length: 400}).map((val, i) => {
        const v = (i + 1) * 100000;

        return {
            value: v,
            label: shortNumberFormat(v)
        }
    })], []);

    const yearsOptions = useCallback((label: string) => [{
        label,
        value: ''
    }, ...Array.apply(null, {length: 40}).map((val, i) => {
        const v = new Date().getFullYear() - i;

        return {
            value: v,
            label: v
        }
    })], []);

    const mileageOptions = useCallback((label: string) => [{
        label,
        value: ''
    }, ...Array.apply(null, {length: 20}).map((val, i) => {
        const v = (i + 1) * 10000;

        return {
            value: v,
            label: shortNumberFormat(v)
        }
    })], []);

    const powerOptions = useCallback((label: string) => [{
        label,
        value: undefined
    }, ...Array.apply(null, {length: 200}).map((val, i) => {
        const v = (i + 1) * 10;

        return {
            value: v,
            label: shortNumberFormat(v)
        }
    })], []);

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
                    <div
                        className="mileage">{car.date !== 'Neuwagen' ? `${car.date.split('/')[1]} г., ${shortNumberFormat(car.mileage)} км` : 'Новый'}, {car.power} л.с.
                    </div>
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
            <Button type="primary" size="large" loading={isCountFetching} onClick={openFilters}
                    style={{margin: 'auto'}}>Найдено {shortNumberFormat(showCount)} предложений</Button>
        </div>
        <Drawer
            title="Фильтры"
            placement="bottom"
            onClose={onClose}
            open={drawer === 'filters'}
            contentWrapperStyle={{maxHeight: '440px'}}
            extra={<Button onClick={clearFilters} style={{padding: 0}} type="link">Сбросить</Button>}
        >
            <div className="filters">
                <Button onClick={showDrawer} size="large">
                    {selectedBrand?.label || 'Марка'}, {selectedModel?.label || 'модель'}
                </Button>
                <Space.Compact size="large">
                    {/*<InputNumber type="phone" placeholder="Цена от" size="large" value={_priceFrom}*/}
                    {/*             className="full-width"*/}
                    {/*             onChange={onChangeParams('_priceFrom')}/>*/}
                    {/*<InputNumber type="phone" placeholder="Цена до" size="large" value={_priceTo}*/}
                    {/*             className="full-width"*/}
                    {/*             onChange={onChangeParams('_priceTo')}/>*/}
                    <MobileSelect options={priceOptions('Цена от')} placeholder="Цена от" size="large"
                                  value={_priceFrom}
                                  className="full-width" onChange={onChangeParams('_priceFrom')}/>
                    <MobileSelect options={priceOptions('Цена до')} placeholder="Цена до" size="large" value={_priceTo}
                                  className="full-width" onChange={onChangeParams('_priceTo')}/>
                </Space.Compact>
                <Space.Compact size="large">
                    <MobileSelect options={mileageOptions('Пробег от')} placeholder="Пробег от" size="large"
                                  value={_mileageFrom}
                                  className="full-width" onChange={onChangeParams('_mileageFrom')}/>
                    <MobileSelect options={mileageOptions('Пробег до')} placeholder="Пробег до" size="large"
                                  value={_mileageTo}
                                  className="full-width" onChange={onChangeParams('_mileageTo')}/>
                    {/*<InputNumber type="number" placeholder="Пробег от" size="middle" value={_mileageFrom}*/}
                    {/*             className="full-width"*/}
                    {/*             onChange={onChangeParams('_mileageFrom')}/>*/}
                    {/*<InputNumber type="number" placeholder="Пробег до" size="middle" value={_mileageTo}*/}
                    {/*             className="full-width"*/}
                    {/*             onChange={onChangeParams('_mileageTo')}/>*/}
                </Space.Compact>
                <Space.Compact size="large">
                    <MobileSelect options={powerOptions('Мощность л.с. от')} placeholder="Мощность л.с. от" size="large"
                                  value={_pwFrom}
                                  className="full-width"
                                  onChange={onChangeParams('_pwFrom')}/>
                    <MobileSelect options={powerOptions('Мощность л.с. до')} placeholder="Мощность л.с. до" size="large"
                                  value={_pwTo}
                                  className="full-width"
                                  onChange={onChangeParams('_pwTo')}/>
                </Space.Compact>
                <Space.Compact size="large">
                    <MobileSelect options={yearsOptions('Год от')} placeholder="Год от" size="large" value={_yearFrom}
                                  className="full-width" onChange={onChangeParams('_yearFrom')}/>
                    <MobileSelect options={yearsOptions('Год до')} placeholder="Год до" size="large" value={_yearTo}
                                  className="full-width" onChange={onChangeParams('_yearTo')}/>
                    {/*<InputNumber type="number" placeholder="Год от" size="large" value={_yearFrom}*/}
                    {/*             className="full-width"*/}
                    {/*             onChange={onChangeParams('_yearFrom')}/>*/}
                    {/*<InputNumber type="number" placeholder="Год до" size="large" value={_yearTo} className="full-width"*/}
                    {/*             onChange={onChangeParams('_yearTo')}/>*/}
                </Space.Compact>
                {/*<Select placeholder="Сортировать по умолчанию" onChange={onChangeSort} options={sortOptions}/>*/}

                <MobileSelect options={sortOptions('Сортировать по умолчанию')} placeholder="Сортировать по умолчанию" size="large" value={sort}
                              className="full-width" onChange={onChangeSort}/>
                <Button type="primary" loading={isCountFetching} onClick={acceptPrice} size="large">
                    Показать {shortNumberFormat(showCount)} предложений
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