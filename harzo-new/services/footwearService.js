import axios from "axios";

const API =
  "https://api.harzo.in/api/footwear";

export const getFootwearCategories = async () => {
  const response = await axios.get(
    `${API}/categories`
  );

  return response.data;
};

export const getFootwearProducts = async () => {
  const response = await axios.get(
    `${API}/products`
  );

  return response.data;
};

export const getProductsByCategory = async (
  categoryId
) => {
  const response = await axios.get(
    `${API}/products/category/${categoryId}`
  );

  return response.data;
};


