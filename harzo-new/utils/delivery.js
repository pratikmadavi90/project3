export const SHOP_LOCATION = {
  latitude: 18.7500,
  longitude: 73.3300,
};

export const calculateDeliveryFee = (distanceKm) => {
  if (distanceKm <= 3) return 25;

  if (distanceKm <= 6) return 40;

  if (distanceKm <= 10) return 60;

  return 80;
};

export const getDistanceFromGoogle = async (
  userLat,
  userLng
) => {
  const apiKey = "AIzaSyC8IBgAMfBDmXDpB9-tir8jHLaKRvlk3ik";

  const url =
    `https://maps.googleapis.com/maps/api/distancematrix/json` +
    `?origins=${SHOP_LOCATION.latitude},${SHOP_LOCATION.longitude}` +
    `&destinations=${userLat},${userLng}` +
    `&key=${apiKey}`;

  const response = await fetch(url);

  const data = await response.json();

  const element = data.rows[0].elements[0];

  const distanceText = element.distance.text;

  const distanceKm = parseFloat(
    distanceText.replace(" km", "")
  );

  return distanceKm;
};