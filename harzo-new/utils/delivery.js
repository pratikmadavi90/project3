export const calculateDeliveryFee = (distanceKm) => {

  if (distanceKm <= 3) return 25;

  if (distanceKm <= 6) return 40;

  if (distanceKm <= 10) return 60;

  return 80;

};


export const getDistance = async (
  userLat,
  userLng
) => {

try{

const response = await fetch(

`https://api.harzo.in/api/distance?lat=${userLat}&lng=${userLng}`

);

const data = await response.json();

return data.distanceKm || 0;

}

catch(error){

console.log(error);

return 0;

}

};