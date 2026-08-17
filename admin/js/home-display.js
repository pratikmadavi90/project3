const categories = [
  "personalCare",
  "snacks",
  "grocery",
  "beverages",
  "dairy",
  "household"
];

const template =
  document.getElementById(
    "itemTemplate"
  );

// ======================
// CREATE 8 BOXES
// ======================

function createBoxes() {

  categories.forEach((category) => {

    const container =
      document.getElementById(
        `${category}Container`
      );

    for (let i = 0; i < 8; i++) {

      const clone =
        template.content.cloneNode(true);

      const card =
        clone.querySelector(".card");

      const imageInput =
        clone.querySelector(".image-input");

      const preview =
        clone.querySelector(".preview");

      const clearBtn =
        clone.querySelector(".clear-btn");

      const saveBtn =
        clone.querySelector(".single-save-btn");

      imageInput.addEventListener(
        "change",
        (e) => {

          const file =
            e.target.files[0];

          if (file) {

            preview.src =
              URL.createObjectURL(file);

          }
        }
      );

      saveBtn.addEventListener(
        "click",
        async () => {

          try {

            const formData =
              new FormData();

            const name =
              card.querySelector(
                ".name-input"
              ).value;

formData.append("section", category);
formData.append("index", i);
formData.append("name", name);

            const file =
              imageInput.files[0];

            if (file) {

formData.append(
  "image",
  file
);

            }

            const token =
              localStorage.getItem(
                "adminToken"
              );

const response =
  await fetch(
    "https://api.harzo.in/api/home-display/save-single",
                {
                  method: "POST",
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                  body: formData,
                }
              );

            const data =
              await response.json();

            alert(
              data.message || "Saved"
            );

          } catch (error) {

            console.log(error);

            alert("Save Failed");

          }
        }
      );

      clearBtn.addEventListener(
        "click",
        () => {

          card.querySelector(
            ".name-input"
          ).value = "";

          imageInput.value = "";

        preview.src = "";

        }
      );

      container.appendChild(
        clone
      );

    }

  });

}

// ======================
// LOAD DATA
// ======================

async function loadData() {

  try {

    const response =
      await fetch(
        "https://api.harzo.in/api/home-display"
      );

    const data =
      await response.json();

    categories.forEach(
      (category) => {

        const cards =
          document.querySelectorAll(
            `#${category}Container .card`
          );

        const items =
          data[category] || [];

        cards.forEach(
          (card, index) => {

            if (
              !items[index]
            )
              return;

            card.querySelector(
              ".name-input"
            ).value =
              items[index].name || "";

            if (
              items[index].image
            ) {

              card.querySelector(
                ".preview"
              ).src =
                items[index].image;
            }
          }
        );
      }
    );

  } catch (error) {

    console.log(error);
  }
}



// ======================
// START
// ======================

createBoxes();

loadData();