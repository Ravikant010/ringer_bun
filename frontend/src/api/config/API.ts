import axios from "axios"

const API = axios.create({
  baseURL: 'http://192.168.9.186:3000',
  timeout: 600000, // 10 minutes in milliseconds
  headers: {
    'Content-Type': 'application/json',

    // You can add other headers as needed
  },
  withCredentials: true
});


export default API;