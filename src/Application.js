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
import Welcome from './screens/Welcome';
// import Main from './screens/Main';

export default class MiniAppStack extends React.Component {
    render() {
        const {
            params = {},
            options = { title: appJson.name }
        } = this.props;

        // check deeplink params
        console.log(this.props.params);

        return <Navigation screen={Welcome} params={params} options={options} />;
    }
}
