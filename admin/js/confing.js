const ENV = "production"; // 🔥 change here

const URLS = {
  local: "http://localhost:5000",
  staging: "https://test.harzo.in",
  production: "https://api.harzo.in"
};

export const BASE_URL = URLS[ENV];