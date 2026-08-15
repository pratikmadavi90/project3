const HomeDisplay = require("../models/HomeDisplay");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

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

let snacks = JSON.parse(
  req.body.snacks || "[]"
);

let grocery = JSON.parse(
  req.body.grocery || "[]"
);

let beverages = JSON.parse(
  req.body.beverages || "[]"
);

let dairy = JSON.parse(
  req.body.dairy || "[]"
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

// SNACKS IMAGE

if (
  field.startsWith(
    "snacks_"
  )
) {

  const index =
    parseInt(
      field.split("_")[1]
    );

  snacks[index].image =
    file.location;
}

// GROCERY IMAGE

if (
  field.startsWith(
    "grocery_"
  )
) {

  const index =
    parseInt(
      field.split("_")[1]
    );

  grocery[index].image =
    file.location;
}

// BEVERAGES IMAGE

if (
  field.startsWith(
    "beverages_"
  )
) {

  const index =
    parseInt(
      field.split("_")[1]
    );

  beverages[index].image =
    file.location;
}

// DAIRY IMAGE

if (
  field.startsWith(
    "dairy_"
  )
) {

  const index =
    parseInt(
      field.split("_")[1]
    );

  dairy[index].image =
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

data.featured = featured;

data.personalCare = personalCare;

data.snacks = snacks;

data.grocery = grocery;

data.beverages = beverages;

data.dairy = dairy;

data.household = household;

      await data.save();

      return res.status(200).json({
        success: true,
        message:
          "Home Display Updated",
        data,
      });

    }

data = await HomeDisplay.create({
  featured: [],
  
  personalCare: [],
  snacks: [],
  grocery: [],
  beverages: [],
  dairy: [],
  household: [],
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
snacks: [],
grocery: [],
beverages: [],
dairy: [],
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

