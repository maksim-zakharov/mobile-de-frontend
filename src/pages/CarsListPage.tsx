import {Button, Drawer, Input, Select, SelectProps, Space, Spin, Tag} from "antd";
import {LeftOutlined, SearchOutlined} from "@ant-design/icons";
import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {
    useGetBrandsQuery,
    useGetCarsCountQuery,
    useGetCarsQuery,
    useGetFeaturesQuery,
    useGetModelsQuery
} from "../api.tsx";
import {moneyFormat, shortNumberFormat} from "../utils.ts";

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
    const con = searchParams.get('con');
    const ft = searchParams.getAll('fuel-type') || [];
    const c = searchParams.getAll('c') || [];
    const tr = searchParams.getAll('tr') || [];
    const fe = searchParams.getAll('fe') || [];
    const page = searchParams.get('page') || '1';
    const {sort: ssort, order} = t(sort);

    let userId = searchParams.get('userId');
    if (window.Telegram?.WebApp?.initDataUnsafe) {
        userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
    }

    const {data: featuresData} = useGetFeaturesQuery({});
    const featuresOptions = featuresData || [];
    const [featureSearch, setFeatureSearch] = useState('');
    const filteredFeaturesOptions = useMemo(() => featuresOptions.filter(fo => fo.ru.toLowerCase().includes(featureSearch.toLowerCase())).sort((a, b) => a.ru.localeCompare(b.ru)), [featuresOptions,featureSearch]);

    const securityFeatures = [
        "ABS",
        "ESP",
        "DISTANCE_WARNING_SYSTEM",
        "HILL_START_ASSIST",
        "SPEED_LIMITER",
        "AIR_SUSPENSION",
        "COLLISION_AVOIDANCE",
        "LANE_DEPARTURE_WARNING",
        "BLIND_SPOT_MONITOR",
        "EMERGENCY_CALL_SYSTEM"
    ]

    const security2Features = [
        "IMMOBILIZER",
        "KEYLESS_ENTRY",
        "CENTRAL_LOCKING",
        "ALARM_SYSTEM"
    ]

    const comfortFeatures = [
        "CRUISE_CONTROL",
        "ELECTRIC_ADJUSTABLE_SEATS",
        "ELECTRIC_BACKSEAT_ADJUSTMENT",
        "ELECTRIC_TAILGATE",
        "POWER_ASSISTED_STEERING",
        "START_STOP_SYSTEM",
        "CRUISE_CONTROL",
        "ADAPTIVE_CRUISE_CONTROL",
        "HEATED_STEERING_WHEEL",
        "ELECTRIC_WINDOWS",
        "ELECTRIC_EXTERIOR_MIRRORS",
        "ELECTRIC_ADJUSTABLE_SEATS",
        "ELECTRIC_BACKSEAT_ADJUSTMENT"
    ]

    const lightsFeatures = [
        "ADAPTIVE_BENDING_LIGHTS",
        "HEATED_WINDSHIELD",
        "BI_XENON_HEADLIGHTS",
        "GLARE_FREE_HIGH_BEAM",
        "HIGH_BEAM_ASSIST",
        "BENDING_LIGHTS",
        "LASER_HEADLIGHTS",
        "LED_HEADLIGHTS",
        "LED_RUNNING_LIGHTS",
        "LIGHT_SENSOR",
        "NIGHT_VISION_ASSIST",
        "FRONT_FOG_LIGHTS",
        "AUTOMATIC_RAIN_SENSOR",
        "HEADLIGHT_WASHER_SYSTEM",
        "DAYTIME_RUNNING_LIGHTS",
        "XENON_HEADLIGHTS",
        "AMBIENT_LIGHTING"
    ]

    const {data, isFetching: isCarLoading, isError: isCarsError, refetch} = useGetCarsQuery({
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
        userId,
        c,
        ft,
        fe,
        con,
        tr
    });
    const {data: brandsData, isLoading: isBrandsLoading} = useGetBrandsQuery({});

    const cars = data?.items || [];

    const [combineResult, setCombineResult] = useState<[]>([]);

    useEffect(() => {
        if (!isCarLoading)
            setCombineResult(prevState => prevState.concat(cars));
    }, [isCarLoading]);

    const showDrawer = () => {
        searchParams.set('drawer', brand ? 'model' : 'brand');
        setSearchParams(searchParams)
    };

    const onClose = () => {
        searchParams.delete('drawer');
        setSearchParams(searchParams)
    };

    const onSelectCar = (id: string) => {
        navigate(id.toString());
    };

    const clearModel = () => {
        setCombineResult([]);
        searchParams.set('drawer', 'brand');
        searchParams.delete('model');
        setSearchParams(searchParams);
    }

    const onSelectBrand = (brandKey: string) => {
        setCombineResult([]);
        searchParams.set('page', '1');
        onChangeParams("_brand")(brandKey);
        searchParams.set('drawer', 'model');
        setSearchParams(searchParams);
        // refetchModels();
    }

    const onSelectModel = (brandKey: string) => {
        setCombineResult([]);
        searchParams.set('page', '1');
        searchParams.set('model', brandKey);
        searchParams.set('drawer', 'filters');
        setSearchParams(searchParams)
        // refetch();
    }

    const clearFilters = () => {
        Array.from(searchParams.keys()).filter(key => key !== 'drawer').forEach(key => searchParams.delete(key));
        setSearchParams(searchParams);
        setParams({
            _brand: brand || '',
            _pwFrom: pwFrom || '',
            _pwTo: pwTo || '',
            _priceFrom: priceFrom || '',
            _priceTo: priceTo || '',
            _mileageFrom: mileageFrom || '',
            _mileageTo: mileageTo || '',
            _yearFrom: yearFrom || '',
            _yearTo: yearTo || '',
            _c: c || [],
            _ft: ft || [],
            _tr: tr || [],
            _fe: fe || [],
            _sort: sort || '',
            _con: con || ''
        })
    }

    const [{
        _pwFrom,
        _pwTo,
        _fe,
        _ft,
        _brand,
        _con,
        _c,
        _sort,
        _tr,
        _priceFrom,
        _priceTo,
        _mileageFrom,
        _mileageTo,
        _yearFrom,
        _yearTo
    }, setParams] = useState({
        _pwFrom: pwFrom || '',
        _pwTo: pwTo || '',
        _con: con || '',
        _priceFrom: priceFrom || '',
        _priceTo: priceTo || '',
        _mileageFrom: mileageFrom || '',
        _mileageTo: mileageTo || '',
        _yearFrom: yearFrom || '',
        _yearTo: yearTo || '',
        _ft: ft || [],
        _c: c || [],
        _tr: tr || [],
        _fe: fe || [],
        _sort: sort || '',
        _brand: brand || '',
    })

    const {
        data: modelsData,
        isFetching: isModelsLoading,
        isError: isModelsError,
        refetch: refetchModels
    } = useGetModelsQuery({brand: _brand}, {
        refetchOnMountOrArgChange: true
    });

    const brands = brandsData || [];
    const models = useMemo(() => (modelsData || []).map(m => m.items ? m.items.map(i => i.isGroup ? ({
        ...i,
        value: `group_${i.value}`
    }) : i) : [m.isGroup ? ({...m, value: `group_${m.value}`}) : m]).flat(), [modelsData]);

    const [modelSearch, setModelSearch] = useState('');
    const filteredModels = useMemo(() => models.filter(m => m.label.toLowerCase().includes(modelSearch.toLowerCase())), [models, modelSearch]);

    const selectedBrand = useMemo(() => brands.find(b => b.value === _brand), [_brand, brands])
    const selectedModel = useMemo(() => models.find(b => b.value === model), [model, models])

    const {data: countData, isFetching: isCountFetching} = useGetCarsCountQuery({
        priceFrom: _priceFrom,
        priceTo: _priceTo,
        mileageFrom: _mileageFrom,
        mileageTo: _mileageTo,
        yearFrom: _yearFrom,
        yearTo: _yearTo,
        pwFrom: _pwFrom,
        pwTo: _pwTo,
        ft: _ft,
        fe: _fe,
        c: _c,
        tr: _tr,
        brand: _brand,
        con: _con,
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

    const onChangeFeatures = (key: string) => (value, checked) => {
        setParams(prevState => {
            const set = new Set(prevState[key] || []);
            if(checked){
                set.add(value)
            } else {
                set.delete(value)
            }

            return {
                ...prevState,
                [key]: Array.from(set)
            }
        });
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
        searchParams.set('sort', _sort);
        searchParams.set('brand', _brand);
        searchParams.set('con', _con)
        searchParams.delete('fuel-type');
        _ft.forEach(f => searchParams.append('fuel-type', f));
        searchParams.delete('c');
        _c.forEach(f => searchParams.append('c', f));
        searchParams.delete('tr');
        _tr.forEach(f => searchParams.append('tr', f));
        searchParams.delete('fe');
        _fe.forEach(f => searchParams.append('fe', f));
        searchParams.set('page', '1');
        searchParams.delete('drawer');
        setSearchParams(searchParams);
        // refetch()
    }

    const openFilters = () => {
        searchParams.set('drawer', 'filters');
        setSearchParams(searchParams)
    }

    const conditionsOptions = useCallback((label: string) => [{
        label,
        value: ''
    }, ...[
        {label: 'Новые', value: 'NEW'},
        {label: 'С пробегом', value: 'USED'},
    ]], [])

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

    const transmissionsOptions = [
        {label: 'Автоматическая', value: 'AUTOMATIC_GEAR'},
        {label: 'Полуавтомат', value: 'SEMIAUTOMATIC_GEAR'},
        {label: 'Механическая', value: 'MANUAL_GEAR'},
    ]

    const categoriesOptions = [
        {label: 'Седан', value: 'Limousine'},
        {label: 'Купе', value: 'SportsCar'},
        {label: 'Кабриолет', value: 'Cabrio'},
        {label: 'Универсал', value: 'EstateCar'},
        {label: 'Внедорожник', value: 'OffRoad'},
    ]

    const fuelTypesOptions = [
        {label: 'Бензин', value: 'PETROL'},
        {label: 'Дизель', value: 'DIESEL'},
        {label: 'Электро', value: 'ELECTRICITY'},
        {label: 'Гибрид/Бензин', value: 'HYBRID_PETROL'},
        {label: 'Гибрид/Дизель', value: 'HYBRID_DIESEL'},
    ]

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
        value: ''
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
            {isCarsError && <Button onClick={refetch} style={{margin: 'auto'}} type="primary">Обновить</Button>}
            {combineResult.map(car => <div onClick={() => onSelectCar(car.id)} className="car-item"
                                           key={car.id}>
                {car.imgUrls[0] && <img src={car.imgUrls[0].replace('mo-160', 'mo-360')}
                                        style={{width: '360px'}}
                                        alt=""/>}
                <div className="details">
                    <div className="price">
                        <div>{moneyFormat(car.price, 0, 0)}</div>
                        <div
                            className="mileage">({moneyFormat(car.priceWithoutVAT, 0, 0)} без VAT)
                        </div>
                    </div>
                    <span className="title">{car.title}</span>
                    {/*<div className="date">{car.date}</div>*/}
                    {/*<h4>Пробег</h4>*/}
                    <div
                        className="mileage">{car.date !== 'Neuwagen' ? `${car.date.split('/')[1]} г., ${shortNumberFormat(car.mileage)} км` : 'Новый'}, {car.power} л.с., {car.fuelType}, {car.transmissionType}
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
            title="Параметры"
            placement="bottom"
            onClose={onClose}
            open={drawer === 'filters'}
            // contentWrapperStyle={{maxHeight: '600px'}}
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
                <MobileSelect options={sortOptions('Сортировать по умолчанию')} placeholder="Сортировать по умолчанию"
                              size="large" value={_sort}
                              className="full-width" onChange={onChangeParams('_sort')}/>
                <MobileSelect options={conditionsOptions('Все')} placeholder="Все"
                              size="large" value={_con}
                              className="full-width" onChange={onChangeParams('_con')}/>

                {/*<Select mode="multiple" options={transmissionsOptions('Все коробки')} placeholder="Все коробки"*/}
                {/*        size="large" value={_tr}*/}
                {/*        className="full-width" onChange={onChangeParams('_tr')}/>*/}
                <h3>Коробка</h3>
                {transmissionsOptions.map((item) => <Tag.CheckableTag
                    key={item.value}
                    checked={_tr.includes(item.value)}
                    onChange={(checked) => onChangeFeatures('_tr')(item.value, checked)}
                >
                    {item.label}
                </Tag.CheckableTag>)}
                {/*<Select mode="multiple" options={categoriesOptions('Все кузова')} placeholder="Все кузова"*/}
                {/*        size="large" value={_c}*/}
                {/*        className="full-width" onChange={onChangeParams('_c')}/>*/}
                <h3>Кузов</h3>
                {categoriesOptions.map((item) => <Tag.CheckableTag
                    key={item.value}
                    checked={_c.includes(item.value)}
                    onChange={(checked) => onChangeFeatures('_c')(item.value, checked)}
                >
                    {item.label}
                </Tag.CheckableTag>)}
                {/*<Select mode="multiple" options={fuelTypesOptions('Все двигатели')} placeholder="Все двигатели"*/}
                {/*        size="large" value={_ft}*/}
                {/*        className="full-width" onChange={onChangeParams('_ft')}/>*/}
                <h3>Двигатель</h3>
                {fuelTypesOptions.map((item) => <Tag.CheckableTag
                    key={item.value}
                    checked={_ft.includes(item.value)}
                    onChange={(checked) => onChangeFeatures('_ft')(item.value, checked)}
                >
                    {item.label}
                </Tag.CheckableTag>)}
                <h2>Комплектация</h2>
                <Input value={featureSearch} size="large" onChange={e => setFeatureSearch(e.target.value)}
                       placeholder="Введите название"/>

                <h4>Безопасность</h4>
                {filteredFeaturesOptions
                    .filter(item => securityFeatures.includes(item.value))
                    .map((item) => <Tag.CheckableTag
                        key={item.value}
                        checked={_fe.includes(item.value)}
                        onChange={(checked) => onChangeFeatures('_fe')(item.value, checked)}
                    >
                        {item.ru}
                    </Tag.CheckableTag>)}
                <h4>Комфорт</h4>

                {filteredFeaturesOptions
                    .filter(item => comfortFeatures.includes(item.value))
                    .map((item) => <Tag.CheckableTag
                        key={item.value}
                        checked={_fe.includes(item.value)}
                        onChange={(checked) => onChangeFeatures('_fe')(item.value, checked)}
                    >
                        {item.ru}
                    </Tag.CheckableTag>)}
                <h4>Обзор</h4>

                {filteredFeaturesOptions
                    .filter(item => lightsFeatures.includes(item.value))
                    .map((item) => <Tag.CheckableTag
                        key={item.value}
                        checked={_fe.includes(item.value)}
                        onChange={(checked) => onChangeFeatures('_fe')(item.value, checked)}
                    >
                        {item.ru}
                    </Tag.CheckableTag>)}
                {/*<h4>Мультимедиа</h4>*/}
                {/*<h4>Салон</h4>*/}
                <h4>Защита от угона</h4>
                {filteredFeaturesOptions
                    .filter(item => security2Features.includes(item.value))
                    .map((item) => <Tag.CheckableTag
                        key={item.value}
                        checked={_fe.includes(item.value)}
                        onChange={(checked) => onChangeFeatures('_fe')(item.value, checked)}
                    >
                        {item.ru}
                    </Tag.CheckableTag>)}
                <h4>Другое</h4>
                {filteredFeaturesOptions
                    .filter(item => !securityFeatures.includes(item.value)
                        && !comfortFeatures.includes(item.value)
                        && !lightsFeatures.includes(item.value)
                        && !security2Features.includes(item.value)
                    )
                    .map((item) => <Tag.CheckableTag
                        key={item.value}
                        checked={_fe.includes(item.value)}
                        onChange={(checked) => onChangeFeatures('_fe')(item.value, checked)}
                    >
                        {item.ru}
                    </Tag.CheckableTag>)}
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
            onClose={clearModel}
            open={drawer === 'model'}
        >
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start'}}>
                <Button type="link" icon={<LeftOutlined/>} onClick={clearModel} style={{padding: 0}}>
                    Выбрать другую марку
                </Button>
                <Input placeholder="Найти модель" suffix={<SearchOutlined/>}
                       onChange={e => setModelSearch(e.target.value)}/>
                {isModelsLoading && <Spin style={{margin: 'auto'}}/>}
                {!isModelsLoading && !isModelsError && filteredModels.map(brand => <div className="list-item"
                                                                                        key={brand.value}
                                                                                        onClick={() => onSelectModel(brand.value)}>{brand.label}</div>)}
                {isModelsError &&
                    <Button onClick={refetchModels} style={{margin: 'auto'}} type="primary">Обновить</Button>}
            </div>
        </Drawer>
    </>
}

export default CarsListPage;