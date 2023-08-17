import request from "./request";
// import { IPaymentSession, IPaymentSessionResponse } from "@services/models";
export const authenticate = (payload) => {
  return request("http://103.2.230.53:8089/api/auth/authenticate", {
    method: "POST",
    data: payload,
  });
};

export const createParkingSessionService = (payload) => {
  return request("http://103.2.230.53:8089/api/parkingsession/get", {
    method: "POST",
    data: payload,
  });
};

export const markParkingSessionService = (payload) => {
  return request("http://103.2.230.53:8089/api/parkingsession/mark-payment", {
    method: "POST",
    data: payload,
  });
};


export const paymentService = (payload) => {
  return request("https://test-payment.momo.vn/v2/gateway/api/create", {
    method: "POST",
    data: payload,
  });
};
