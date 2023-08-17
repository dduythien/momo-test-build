import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView
} from "react-native";
import { Spacing, Text, Button, Popup } from "@momo-kits/core";

import { InforTable } from "@momo-kits/bank";

import { useRequest } from "ahooks";
import MiniApi from "@momo-miniapp/api";
import { COOKIE_NAMES } from "../utils/constant";
import _get from "lodash/get";
import { paymentService } from "../api";
import { handleFormatMoney } from "../utils/utils";
import momoConfig from '../momoConfig'


import CryptoJS from "crypto-js";


const data1 = [
  { title: "MobiFone" },
  { title: "VinaPhone" },
  { title: "Viettel" },
  { title: "Vietnamobile" },
  { title: "GMobile" },
];

const DetailScreen = (props) => {
  const [paymentInfo, setPaymentInfo] = useState({});
  const [paymentDisplayInfo, setPaymentDisplayInfo] = useState([]);

  useEffect(() => {
    const data = _get(props, "params.data.item");
    console.log(props);
    const inforTableData = [
      {
        title: "Dịch vụ",
        value: "Thu hộ phí giữ xe toà nhà 285 CMT8",
      },
      {
        title: "Mã nhà cung cấp",
        value: data.companyCode,
      },
      {
        title: "Mã đơn hàng",
        value: String(data.parkingSessionId),
      },
      {
        title: "Mã hoá đơn",
        value: data.transactionId,
      },
      {
        title: "Số tiền giao dịch",
        value: handleFormatMoney(data.fee, "đ"),
      },
    ];
    setPaymentDisplayInfo(inforTableData);
    setPaymentInfo(data)
  }, []);

  const { runAsync: goPayment, error } = useRequest(
    (payload) =>
    paymentService(payload),
    {
      onBefore: () => {
        MiniApi.showLoading()
      },
      onSuccess: async (data) => {
        console.log(data)
        const {resultCode, deeplinkMiniApp} = data;
        if (resultCode === 0 && deeplinkMiniApp) {
          MiniApi.openURL(deeplinkMiniApp);
        } else {
          const { navigator } = props;
          MiniApi.showAlert(
            "Thông báo",
            'Chưa cấp quyền sử dụng deepLink miniApp',
            ["OK"]
          )
        }
      },
      onError: async (data) => {
        MiniApi.showAlert(
          "Thông báo",
          'Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin',
          ["OK"]
        )
      },
      onFinally: () => {
        MiniApi.hideLoading()
      },
      manual: true
    },
  );

  const onPayment = async() => {

    const date = new Date().getTime();
    const requestId = date+"id";
    const orderId = date +":0123456778";
    
    const amount = paymentInfo.fee;
    // const orderId = paymentInfo.id;
    // const requestId = paymentInfo.transactionId;

    const orderInfo = "Thu hộ phí giữ xe toà nhà 285 CMT8";
    const partnerCode = momoConfig.partnerCode;
    const extraData = momoConfig.extraData;
    const accessKey = momoConfig.accessKey;

    const redirectUrl =  momoConfig.redirectUrl;
    const ipnUrl = momoConfig.ipnUrl;
    const requestType = "captureWallet";
    const paymentCode = "MOMO";
    const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode +  "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
 
    const secretKey = momoConfig.secretKey;
    const hash = CryptoJS.HmacSHA256(rawSignature, secretKey);
    const signature = CryptoJS.enc.Hex.stringify(hash);

    const payload = {
      partnerName: "VTM",
      partnerCode,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl, //TODO:
      requestType,
      extraData,
      signature,
      lang: "vi",
      autoCapture: true,
      storeId: partnerCode,
    }
    console.log(payload)
    console.log("SET RCOOKIE_NAMES.PARKING_SESSION_ID: ", paymentInfo.parkingSessionId)
    await MiniApi.setItem(COOKIE_NAMES.PARKING_SESSION_ID, paymentInfo.parkingSessionId);

    await goPayment(payload)
  
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <InforTable
          autoAlignItem
          style={{ paddingBottom: Spacing.L }}
          title={
            <Text variant="h4" weight="bold">
              Thông tin chi tiết
            </Text>
          }
          data={paymentDisplayInfo}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            padding: Spacing.L,
          }}
        >
          <Button title="Tiếp tục" onPress={onPayment} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DetailScreen;
