import {useGetCarByIdQuery} from "../api.tsx";
import {useParams, useSearchParams} from "react-router-dom";

const CarDetailsPage = () => {
    const {id} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    let userId = searchParams.get('userId');
    if(window.Telegram?.WebApp?.initDataUnsafe){
        userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
    }

    const {data} = useGetCarByIdQuery({userId, id}, {
        skip: !id
    });

    const technical = data?.technicalData || [];

    return <div className="container">
        <h2>Характеристики</h2>
        {technical.map(item => <div className="labelValue" key={item.key}>
            <div className="label">{item.label}</div>
            <div className="value">{item.value}</div>
        </div>)}
    </div>
}

export default CarDetailsPage