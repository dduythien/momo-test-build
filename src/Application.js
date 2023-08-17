/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Navigation } from '@momo-kits/core';
import appJson from '../app.json';
import Main from './screens/Main';
import ResultScreen from './screens/Result';

export default class MiniAppStack extends React.Component {
    render() {
        const {
            params = {},
            options = { title: appJson.name }
        } = this.props;

        // check deeplink params
        console.log(this.props.params);
        if (this.props.params && this.props.params.transId) {
    
            return <Navigation screen={ResultScreen} params={params} options={{title: "Kết quả thanh toán"}} />;
        }

        return <Navigation screen={Main} params={params} options={options} />;
    }
}
