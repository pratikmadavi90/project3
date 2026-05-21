const express = require("express");

const router = express.Router();

const SHOP_LOCATION = {
latitude:18.7500,
longitude:73.3300
};

router.get("/", async(req,res)=>{

try{

const {lat,lng}=req.query;

const apiKey =
process.env.GOOGLE_MAP_KEY;

const url =

`https://maps.googleapis.com/maps/api/distancematrix/json` +

`?origins=${SHOP_LOCATION.latitude},${SHOP_LOCATION.longitude}` +

`&destinations=${lat},${lng}` +

`&key=${apiKey}`;

const response =
await fetch(url);

const data =
await response.json();

const distanceText =
data.rows[0]
.elements[0]
.distance
.text;

const distanceKm =
parseFloat(
distanceText.replace(
" km",
""
)
);

res.json({
distanceKm
});

}

catch(error){

console.log(error);

res.status(500).json({
error:"Distance failed"
});

}

});

module.exports = router;