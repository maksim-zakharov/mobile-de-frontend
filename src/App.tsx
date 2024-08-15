import React from 'react'
import './App.css'
import {useGetCarsQuery} from "./api.tsx";
import {Carousel} from "antd";

export const moneyFormat = (money: number, maximumFractionDigits = undefined, minimumFractionDigits = undefined) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits,
      minimumFractionDigits
    }).format(money);

export const shortNumberFormat = (number: number,minimumFractionDigits = undefined, maximumFractionDigits = 1) =>
    Intl.NumberFormat('ru-RU', {
      // notation: 'compact',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(number || 0);

function App() {

    const {data} = useGetCarsQuery({});

  const cars = data?.items || [];

  return (
    <>
        {cars.map(car => <div className="car-item">
          <h2 className="title">{car.title}</h2>
          <div className="date">{car.date}</div>
          <h4>Цена</h4>
          <div className="price">{moneyFormat(car.price * 100)}</div>
          <h4>Пробег</h4>
          <div className="mileage">{shortNumberFormat(car.mileage)} км</div>
          <h4>Описание</h4>
          <p className="details">{car.detailsText}</p>
          <Carousel>
            {car.imgUrls.map(imgUrl => <img src={imgUrl.replace('mo-160', 'mo-360')} style={{width: '360px'}} alt=""/>)}
          </Carousel>
        </div>)}
    </>
  )
}

export default App
