const HomeDisplay = require("../models/HomeDisplay");

// GET HOME DISPLAY
exports.getHomeDisplay = async (req, res) => {
  try {
    let data = await HomeDisplay.findOne();

    if (!data) {
      data = await HomeDisplay.create({
        featured: [],
        personalCare: [],
        household: [],
      });
    }

    res.status(200).json(data);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Home Display",
    });
  }
};

// SAVE HOME DISPLAY
exports.saveHomeDisplay = async (req, res) => {
  try {

    let featured = JSON.parse(
      req.body.featured || "[]"
    );

    let personalCare = JSON.parse(
      req.body.personalCare || "[]"
    );

    let household = JSON.parse(
      req.body.household || "[]"
    );

    // =====================
    // S3 URL MAPPING
    // =====================

    if (req.files && req.files.length) {

      req.files.forEach((file) => {

        const field =
          file.fieldname;

        // FEATURED IMAGES

        if (
          field.startsWith(
            "featured_"
          )
        ) {

          const parts =
            field.split("_");

          const cardIndex =
            parseInt(parts[1]);

          const imageIndex =
            parseInt(parts[3]);

          if (
            !featured[
              cardIndex
            ].images
          ) {
            featured[
              cardIndex
            ].images = [];
          }

          featured[
            cardIndex
          ].images[
            imageIndex
          ] = file.location;
        }

        // PERSONAL CARE IMAGE

        if (
          field.startsWith(
            "personalCare_"
          )
        ) {

          const index =
            parseInt(
              field.split("_")[1]
            );

          personalCare[
            index
          ].image =
            file.location;
        }

        // HOUSEHOLD IMAGE

        if (
          field.startsWith(
            "household_"
          )
        ) {

          const index =
            parseInt(
              field.split("_")[1]
            );

          household[
            index
          ].image =
            file.location;
        }

      });

    }

    let data =
      await HomeDisplay.findOne();

    if (data) {

      data.featured =
        featured;

      data.personalCare =
        personalCare;

      data.household =
        household;

      await data.save();

      return res.status(200).json({
        success: true,
        message:
          "Home Display Updated",
        data,
      });

    }

    data =
      await HomeDisplay.create({
        featured,
        personalCare,
        household,
      });

    res.status(201).json({
      success: true,
      message:
        "Home Display Created",
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

// CLEAR HOME DISPLAY
exports.clearHomeDisplay = async (
  req,
  res
) => {
  try {

    await HomeDisplay.updateMany(
      {},
      {
        featured: [],
        personalCare: [],
        household: [],
      }
    );

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
        "Failed to clear data",
    });
  }
};

