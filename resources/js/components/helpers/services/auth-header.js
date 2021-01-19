export default function authHeader() {
  const token = localStorage.getItem('access_token');
    
  if (token) {
    return `Bearer ${token}`; 
  }  else {
    return {}
  }  
}