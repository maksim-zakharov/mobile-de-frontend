import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.less'
import {Provider} from "react-redux";
import {store} from "./store.ts";

import dayjs from "dayjs";
import "dayjs/locale/ru";
import updateLocale from "dayjs/plugin/updateLocale";

import moment from "moment/moment"; // without this line it didn't work
import ru_RU from 'antd/es/locale/ru_RU';
import {ConfigProvider} from "antd";

import { BrowserRouter, HashRouter } from 'react-router-dom';

dayjs.extend(updateLocale);
dayjs.updateLocale("zh-cn", {
    weekStart: 0
});

moment().locale('ru');

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ConfigProvider locale={ru_RU}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </ConfigProvider>
        </Provider>
    </StrictMode>,
)
