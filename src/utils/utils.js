import { Platform } from 'react-native';
import { NumberUtils } from '@momo-kits/core';
import MiniApi from "@momo-miniapp/api";
import moment from 'moment'

export const getStore = (key) => {
  return new Promise(resolve => {
    MiniApi.getItem(key, (data) => {
      resolve(data)
    } )
  } );

}

export const handleFormatMoney = (
  money,
  currency,
) => {
  if (!money) return 0;
  const fix = Number(money).toFixed();
  const convertString = fix + "";
  const value = "" + convertString?.replace(/\./g, "");
  const format = value?.replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0";
  return `${format} ${currency || ""} `;
};

export const getFontWeightMedium = () => {
  return Platform.OS === 'android' ? 'bold' : '600';
}

export const  formatNumberToMoney = (number, currency = 'đ') => {
  return NumberUtils.formatNumberToMoney(number, currency);
}

export const formatTimeByGTM7 =(timestamp, format = 'HH:mm - DD/MM/YYYY') =>  {
  return moment(timestamp).utcOffset(7).format(format);
}