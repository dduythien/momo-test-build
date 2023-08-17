import React, { useState, useEffect } from "react";
import { View, SafeAreaView } from "react-native";
import { Spacing, Text, Input, Button } from "@momo-kits/core";


import { RadioList } from "@momo-kits/radio";

import {useRequest} from 'ahooks'
import MiniApi from "@momo-miniapp/api";
import {COOKIE_NAMES} from '../utils/constant'
import _get from 'lodash/get'
import Detail from './Detail';
import {authenticate, createParkingSessionService} from '../api';

const data4 = [{ title: "Viettel Complex", value: "ViettelComplex" }];

const data1 = [
  { title: "MobiFone" },
  { title: "VinaPhone" },
  { title: "Viettel" },
  { title: "Vietnamobile" },
  { title: "GMobile" },
];

const TYPE_INFO = {
  VEHICLE_NUMBER:  'Biển số xe',
  CARD_LABEL: 'Mã thẻ xe',
}

const HomeScreen = (props) => {

  const data = [
    { name: "Item 1.1", test: "1" },
    { name: "Item 1.1", test: "2" },
    { name: "Item 1.1", test: "3" },
    { name: "Item 1.1", test: "14" },
  ];

  const [typeInfo, setTypeInfo] = useState(0)

  const [partnerCode, setPartnerCode] = useState('viettelComplex')
  const [cardLabel, setCardLabel] = useState('') //8815
  const [vehicleNumber, setVehicleNumber] = useState('') //51H-31401
  const { run: fetchAccount } = useRequest(
    () =>
      authenticate({
        userName: "momo",
        password: "123456",
      }),
    {
      onBefore: () => {
        MiniApi.showLoading()
      },
      onSuccess: async (data) => {
        const accessToken = _get(data, "item.accessToken");
        await MiniApi.setItem(COOKIE_NAMES.ACCESS_TOKEN, accessToken);
        MiniApi.hideLoading()
      },
    },
  );

  const { run: createParkingSession } = useRequest(
    (payload) =>
    createParkingSessionService(payload),
    {
      onBefore: () => {
        MiniApi.showLoading()
      },
      onSuccess: async (data) => {
        if(!data.success) {
          MiniApi.showAlert(
            "Thông báo",
            data.errorMessage,
            ["OK"]
          )
        } else {
          const { navigator } = props;
          navigator.push({
            screen: Detail,
            options: {title: "Thanh toán"},
            params: {
              data
            }
          })
        }
      },
      onFinally: () => MiniApi.hideLoading()
    },
  );

  const onNext = () => {
    console.log("!vehicleNumber && !cardLabel: ", !vehicleNumber && !cardLabel)
    if(!vehicleNumber && !cardLabel) {
      MiniApi.showAlert(
        "Thông báo",
        "Vui lòng nhập đủ thông tin",
        ["OK"]
      )
      return;
    }
    const payload = {
      cardLabel,
      vehicleNumber,
      partnerCode,
      companyCode: "MOMO",
      bypassCheckFee: true,
    };
    createParkingSession(payload)
  }

  useEffect(() => {
    fetchAccount()
  }, [])

  const onChangeInfoType = (type) => {
    if (type === 0) {
      setCardLabel("")
    } else {
      setVehicleNumber("")
    }
    setTypeInfo(type)
  }

  const onChangeInfo = (text) => {
    if(text === 0) {
      setVehicleNumber(text)
    } else {
      setCardLabel(text)
    }
  }
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: Spacing.XL, flex: 1 }}>
        <View style={{ marginBottom: Spacing.XL }}>
          <Text variant="h4" weight="bold">
            Thông tin chi tiết
          </Text>
        </View>

        {/* <AutoComplete
          data={data4}
          onSelected={(selected) => console.log(selected.value)}
        >
          <Input
            keyAutoComplete="title-value"
            cancellable
            floatingValue="Nhập bãi giữ xe"
            placeholder="Nhập dữ liệu"
            value={partnerCode}
            disable
          />
        </AutoComplete> */}
          <Input
          onChangeText={ (text) => setPartnerCode(text)}
          placeholder="Nhập dữ liệu"
          // cancellable
          floatingValue={"Bãi giữ xe"}
          floatingIcon={null}
          floatingIconStyle={{}}
          floatingNumberOfLines={1}
          value={partnerCode}
          disabled
        />

        <RadioList
          data={[
            TYPE_INFO.VEHICLE_NUMBER,
            TYPE_INFO.CARD_LABEL
          ]}
          defaultIndex={0}
          disableButtons={null}
          itemContainerStyle={{}}
          listProps={{}}
          direction="row"
          onChange={ (data) => onChangeInfoType(data)}
          style={{marginBottom: Spacing.XL}}
          title="Lựa chọn loại xác minh"
          titleStyle={{ paddingBottom: Spacing.XS}}
          valueStyle={{}}
        />
        {
          typeInfo === 0 ?
             <Input
             onChangeText={(text) => setVehicleNumber(text)}
             placeholder="Nhập dữ liệu"
             cancellable
             floatingValue={"Biển số xe" }
             floatingIcon={null}
             floatingIconStyle={{}}
             floatingNumberOfLines={1}
             value={vehicleNumber}
           /> :
           <Input
             onChangeText={(text) => setCardLabel(text)}
             placeholder="Nhập dữ liệu"
             cancellable
             floatingValue={"Mã thẻ xe"}
             floatingIcon={null}
             floatingIconStyle={{}}
             floatingNumberOfLines={1}
             value={cardLabel}
             />
        }
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <Button title="Tiếp tục" onPress={onNext} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
