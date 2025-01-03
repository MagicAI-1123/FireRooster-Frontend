import apiClient from "../axios";
import { IGetAlertsPayload, IGetAlertsResponse, IGetGranteesResponse, IGetUnlockContactInfoPayload, IGetUnlockContactInfoResponse } from "./types/alert.type";
import {
  IGetAlertByIdPayload,
  IGetAlertByIdResponse,
} from "./types/alert.type";

export const alertService = {
  async getAllAlerts(payload: IGetAlertsPayload) {
    const endPoint = "/api/alerts/get-alerts-by-filter";
    try {
      const response = await apiClient.post<IGetAlertsResponse>(
        `${endPoint}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAlertsById(payload: IGetAlertByIdPayload) {
    const endPoint = "/api/alerts/get-alert-by-id";
    try {
      const response = await apiClient.post<IGetAlertByIdResponse>(
        `${endPoint}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async unlockContactInfo(payload: IGetUnlockContactInfoPayload) {
    const endPoint = "/api/alerts/unlock-contact-info"
    try {
      const response = await apiClient.post<IGetUnlockContactInfoResponse>(
        `${endPoint}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getGrantees(payload: IGetUnlockContactInfoPayload) {
    const endPoint = "/api/alerts/get-grantee-info"
    try {
      const response = await apiClient.post<IGetGranteesResponse>(
        `${endPoint}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

};
