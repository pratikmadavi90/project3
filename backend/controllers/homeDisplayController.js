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

    let data =
      await HomeDisplay.findOne();

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