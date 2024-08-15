import React from 'react'
import './App.css'
import {useGetCarsQuery} from "./api";
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
        <div className="car-item-container">
            {cars.map(car => <div className="car-item">
                {/*<h4>Описание</h4>*/}
                {/*<p className="details">{car.detailsText}</p>*/}
                <Carousel>
                    {car.imgUrls.map(imgUrl => <img src={imgUrl.replace('mo-160', 'mo-360')} style={{width: '360px'}}
                                                    alt=""/>)}
                </Carousel>
                <div className="details">
                    <div className="price">{moneyFormat(car.price * 100, 0, 0)}</div>
                    <span className="title">{car.title}</span>
                    {/*<div className="date">{car.date}</div>*/}
                    {/*<h4>Пробег</h4>*/}
                    <div className="mileage">{car.date.split('/')[1]} г., {shortNumberFormat(car.mileage)} км</div>
                </div>
            </div>)}
        </div>
    </>
  )
}

export default App
