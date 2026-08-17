const HomeDisplay = require("../models/HomeDisplay");

const {
  S3Client,
  DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID,

    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ==========================
// GET HOME DISPLAY
// ==========================

exports.getHomeDisplay = async (
  req,
  res
) => {
  try {

    let data =
      await HomeDisplay.findOne();

    if (!data) {

      data =
        await HomeDisplay.create({
          personalCare: Array(8).fill({
            name: "",
            image: "",
          }),

          snacks: Array(8).fill({
            name: "",
            image: "",
          }),

          grocery: Array(8).fill({
            name: "",
            image: "",
          }),

          beverages: Array(8).fill({
            name: "",
            image: "",
          }),

          dairy: Array(8).fill({
            name: "",
            image: "",
          }),

          household: Array(8).fill({
            name: "",
            image: "",
          }),
        });
    }

    res.status(200).json(data);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed To Load Data",
    });
  }
};

// ==========================
// SAVE HOME DISPLAY
// ==========================

exports.saveHomeDisplay = async (
  req,
  res
) => {
  try {

    const personalCare =
      JSON.parse(
        req.body.personalCare ||
        "[]"
      );

    const snacks =
      JSON.parse(
        req.body.snacks ||
        "[]"
      );

    const grocery =
      JSON.parse(
        req.body.grocery ||
        "[]"
      );

    const beverages =
      JSON.parse(
        req.body.beverages ||
        "[]"
      );

    const dairy =
      JSON.parse(
        req.body.dairy ||
        "[]"
      );

    const household =
      JSON.parse(
        req.body.household ||
        "[]"
      );

 if (req.files && req.files.length) {

  req.files.forEach((file) => {

    const field = file.fieldname;

    if (field.startsWith("personalCare_")) {
      const index = parseInt(field.split("_")[1]);
      if (personalCare[index]) {
        personalCare[index].image = file.location;
      }
    }

    if (field.startsWith("snacks_")) {
      const index = parseInt(field.split("_")[1]);
      if (snacks[index]) {
        snacks[index].image = file.location;
      }
    }

    if (field.startsWith("grocery_")) {
      const index = parseInt(field.split("_")[1]);
      if (grocery[index]) {
        grocery[index].image = file.location;
      }
    }

    if (field.startsWith("beverages_")) {
      const index = parseInt(field.split("_")[1]);
      if (beverages[index]) {
        beverages[index].image = file.location;
      }
    }

    if (field.startsWith("dairy_")) {
      const index = parseInt(field.split("_")[1]);
      if (dairy[index]) {
        dairy[index].image = file.location;
      }
    }

    if (field.startsWith("household_")) {
      const index = parseInt(field.split("_")[1]);
      if (household[index]) {
        household[index].image = file.location;
      }
    }

  });

}     

    let data =
 
    await HomeDisplay.findOne();

const oldData = data;

if (oldData) {
  personalCare.forEach((item, i) => {
    if (!item.image) {
      item.image = oldData.personalCare?.[i]?.image || "";
    }
  });

  snacks.forEach((item, i) => {
    if (!item.image) {
      item.image = oldData.snacks?.[i]?.image || "";
    }
  });

  grocery.forEach((item, i) => {
    if (!item.image) {
      item.image = oldData.grocery?.[i]?.image || "";
    }
  });

  beverages.forEach((item, i) => {
    if (!item.image) {
      item.image = oldData.beverages?.[i]?.image || "";
    }
  });

  dairy.forEach((item, i) => {
    if (!item.image) {
      item.image = oldData.dairy?.[i]?.image || "";
    }
  });

  household.forEach((item, i) => {
    if (!item.image) {
      item.image = oldData.household?.[i]?.image || "";
    }
  });
}

    if (!data) {



      data =
        new HomeDisplay();
    }

    data.personalCare =
      personalCare;

    data.snacks =
      snacks;

    data.grocery =
      grocery;

    data.beverages =
      beverages;

    data.dairy =
      dairy;

    data.household =
      household;

    await data.save();

    res.status(200).json({
      success: true,
      message:
        "Home Display Saved",
      data,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ==========================
// CLEAR HOME DISPLAY
// ==========================

exports.clearHomeDisplay =
  async (
    req,
    res
  ) => {
    try {

      let data =
        await HomeDisplay.findOne();

      if (!data) {

        return res.status(200).json({
          success: true,
          message:
            "Already Empty",
        });
      }

      data.personalCare =
        Array(8).fill({
          name: "",
          image: "",
        });

      data.snacks =
        Array(8).fill({
          name: "",
          image: "",
        });

      data.grocery =
        Array(8).fill({
          name: "",
          image: "",
        });

      data.beverages =
        Array(8).fill({
          name: "",
          image: "",
        });

      data.dairy =
        Array(8).fill({
          name: "",
          image: "",
        });

      data.household =
        Array(8).fill({
          name: "",
          image: "",
        });

      await data.save();

      res.status(200).json({
        success: true,
        message:
          "Home Display Cleared",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed To Clear",
      });
    }
  };


 exports.saveSingleBox = async (req, res) => {
  try {
    const { section, index, name } = req.body;

    let data = await HomeDisplay.findOne();

    if (!data) {
      data = await HomeDisplay.create({});
    }

    if (!data[section]) {
      return res.status(400).json({
        success: false,
        message: "Invalid section",
      });
    }

    const boxIndex = Number(index);

if (!data[section][boxIndex]) {
  data[section][boxIndex] = {
    name: "",
    image: ""
  };
}

    if (name !== undefined) {
      data[section][boxIndex].name = name;
    }

    if (req.files && req.files.length > 0) {
      data[section][boxIndex].image =
        req.files[0].location;
    }

    await data.save();

    res.status(200).json({
      success: true,
      message: "Box Saved Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 