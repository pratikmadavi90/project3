const FootwearSettings =
require("../models/FootwearSettings");

exports.getSettings =
async (req,res)=>{

  let settings =
  await FootwearSettings.findOne();

  if(!settings){

    settings =
    await FootwearSettings.create({
      enabled:false
    });

  }

  res.json(settings);

};

exports.updateSettings =
async (req,res)=>{

  let settings =
  await FootwearSettings.findOne();

  if(!settings){

    settings =
    await FootwearSettings.create({
      enabled:req.body.enabled
    });

  }else{

    settings.enabled =
    req.body.enabled;

    await settings.save();

  }

  res.json(settings);

};