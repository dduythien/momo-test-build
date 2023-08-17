/**
 * @format
 */
import React from 'react';
import App from './src/Application';
import AppJson from './app.json';
import { ApplicationStyle } from '@momo-kits/core';
import MiniApi from '@momo-miniapp/api';
ApplicationStyle();

export const MiniApp = props => {
    return <App {...props} />;
};

/**
 * do not change codes bellow
 */
if (__DEV__) {
    AppJson.bridgeMode = 2;
}

MiniApi.registerApp(AppJson, () => MiniApp);
