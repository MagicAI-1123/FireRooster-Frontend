import apiClient from "../axios";

export const userlistService = {
  async insertUserStatus(payload: any) {
    const endPoint = "/api/userlist/insert-user-status";
    const response = await apiClient.post(endPoint, payload);
    return response.data;
  },
  async updateUserStatus(payload: any) {
    const endPoint = "/api/userlist/update-user-status";
    const response = await apiClient.post(endPoint, payload);
    return response.data;
  },
  async getUserStatus() {
    const endPoint = "/api/userlist/get-user-status";
    const response = await apiClient.get(endPoint);
    console.log(response.data);
    return response.data;
  }
}