const ENV = "local";

const URLS = {
  local: "http://192.168.1.5:5000",  
  production: "https://api.harzo.in"
};

export const BASE_URL = URLS[ENV];