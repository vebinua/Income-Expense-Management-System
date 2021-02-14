import axios from 'axios';
import Moment from 'moment';
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

  getNetWorth(userId) {

    return axiosInstance.get('/api/wallets/'+userId+'/current-balance/all', 
      {params: { token: this.getToken(), uncacher: Date.now()}});   
  }

  getCurrencies() {
    return axiosInstance.get('/api/currencies', {params: { token: this.getToken() }});
  }

  postUser(data) {
     return axiosInstance.post('/api/users/login', {data}, {params: { token: this.getToken() }});
  }

  postWallet(data) {
    return axiosInstance.post('/api/wallets', {data}, {params: { token: this.getToken() }});
  }

  postSubcategory(data) {
    return axiosInstance.post('/api/subcategories', {data}, {params: { token: this.getToken() }});
  }  

  postCategories(data) {
    return axiosInstance.post('/api/categories', {data}, {params: { token: this.getToken() }});
  }

  putCategory(data, id) {
    return axiosInstance.put('/api/categories/'+id, {data}, {params: { token: this.getToken() }});
  }

  putWallet(data, id) {
    return axiosInstance.put('/api/wallets/'+id, {data}, {params: { token: this.getToken() }});
  }

  postTransaction(data) {
    return axiosInstance.post('/api/transactions', {data}, {params: { token: this.getToken() }});
  }

  getWalletsByUser(userId) {
    return axiosInstance.get('/api/wallets/'+userId, 
      {params: { token: this.getToken(), uncacher: Date.now()}});
  }

  getUserWalletById(userId, walletId) {
    return axiosInstance.get('/api/wallets/'+userId+'/'+walletId, 
      {params: { token: this.getToken(), uncacher: Date.now()}});
  }

  getTransactionsByUser(userId) {
    return axiosInstance.get('/api/transactions/'+userId, 
      {params: { token: this.getToken(), uncacher: Date.now()}});
  }

  getUserCategoryById(userId, categoryId) {
    return axiosInstance.get('/api/categories/'+userId+'/'+categoryId, 
      {params: { token: this.getToken(), uncacher: Date.now()}});
  }

  getCategories(userId) {
    return axiosInstance.get('/api/categories/'+userId, 
      {params: { token: this.getToken(), uncacher: Date.now()}});
  }

  getUserCategory(categoryId, userId) {
    return axiosInstance.get('/api/categories/'+categoryId+'/user/'+userId, 
      {params: { token: this.getToken(), uncacher: Date.now()}});
  }

  getCategoriesWithSub(userId, accountType) {
    return axiosInstance.get('/api/categories/withsub/'+userId+'/'+accountType, 
      {params: { token: this.getToken(), uncacher: Date.now()}});
  }

  getCategoriesByUser(userId) {
    return axiosInstance.get('/api/categories/'+userId, 
      {params: { token: this.getToken(), uncacher: Date.now()}});
  }

  /*returns only the parent categories*/
  getUserCategoriesByType(userId, accountType) {
    return axiosInstance.get('/api/categories/'+userId+'/'+accountType, 
      {params: { token: this.getToken(), uncacher: Date.now()}});
  }

  getFlowsByMonthYear(userId, month, year) {
    return axiosInstance.get('/api/transactions/'+userId+'/'+month+'/'+year, 
      {params: { token: this.getToken(), uncacher: Date.now()}});  
  }

  getMonthlyIncomeAndExpense(userId) {
    let date = new Date();
    //retrieve current month and year
    let month = Moment(date).format('MMMM');
    let year = Moment(date).format('YYYY');

    return this.getFlowsByMonthYear(userId, month, year);
  }

  deleteWallet(walletId, userId) {
    return axiosInstance.delete('/api/wallets/'+walletId, 
    {params: { token: this.getToken(), walletId: walletId, userId: userId}});
  }

  deleteCategory(categoryId, userId) {
    return axiosInstance.delete('/api/categories/'+categoryId, 
    {params: { token: this.getToken(), categoryId: categoryId, userId: userId}});
  }

  validateServiceResponse(response) {

    console.log(response);

    let isValid = false;

    isValid = (response.data.isUnauthorized && response.data.isUnauthorized) ? false : true;
    
    return isValid;
  }
}

export default new ApiService();