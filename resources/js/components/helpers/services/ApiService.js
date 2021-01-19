import axios from 'axios';
import authHeader from './auth-header';


const axiosInstance = axios.create({
  baseURL: window.config.baseUrl,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

axiosInstance.defaults.headers.common['Authorization'] = authHeader();
axiosInstance.defaults.headers = {
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
};      

class ApiService {

  getToken() {
    return localStorage.getItem('access_token');    
  }

  getCurrencies() {
    return axiosInstance.get('/api/currencies', {params: { token: this.getToken() }});
  }

  postWallet(data) {
    return axiosInstance.post('/api/wallets', {data}, {params: { token: this.getToken() }});
  }

  getWalletsByUser(userId) {
    
    return axiosInstance.get('/api/wallets/'+userId, 
      {params: { token: this.getToken(), uncacher: Date.now()}});
  }

  deleteWallet(walletId, userId) {

    return axiosInstance.delete('/api/wallets/'+walletId, 
    {params: { token: this.getToken(), walletId: walletId, userId: userId}});

  }

  validateServiceResponse(response) {

    let isValid = false;

    isValid = (response.data.isUnauthorized && response.data.isUnauthorized) ? false : true;
    
    return isValid;
  }
}

export default new ApiService();