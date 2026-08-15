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

  categories.forEach(
    (category) => {

      const container =
        document.getElementById(
          `${category}Container`
        );

      for (
        let i = 0;
        i < 8;
        i++
      ) {

        const clone =
          template.content.cloneNode(
            true
          );

        const card =
          clone.querySelector(
            ".card"
          );

        const imageInput =
          clone.querySelector(
            ".image-input"
          );

        const preview =
          clone.querySelector(
            ".preview"
          );

        const clearBtn =
          clone.querySelector(
            ".clear-btn"
          );

        imageInput.addEventListener(
          "change",
          (e) => {

            const file =
              e.target.files[0];

            if (file) {

              preview.src =
                URL.createObjectURL(
                  file
                );
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

            preview.src =
              "https://via.placeholder.com/120";
          }
        );

        container.appendChild(
          clone
        );
      }
    }
  );
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
// SAVE
// ======================

document
  .getElementById(
    "saveBtn"
  )
  .addEventListener(
    "click",
    async () => {

      try {

        const formData =
          new FormData();

        categories.forEach(
          (category) => {

            const items =
              [];

            const cards =
              document.querySelectorAll(
                `#${category}Container .card`
              );

            cards.forEach(
              (
                card,
                index
              ) => {

                items.push({
                  name:
                    card.querySelector(
                      ".name-input"
                    ).value,

                  category:
                    category
                });

                const file =
                  card.querySelector(
                    ".image-input"
                  ).files[0];

                if (file) {

                  formData.append(
                    `${category}_${index}_image`,
                    file
                  );
                }
              }
            );

            formData.append(
              category,
              JSON.stringify(
                items
              )
            );
          }
        );

        const token =
          localStorage.getItem(
            "adminToken"
          );

const response =
          await fetch(
            "https://api.harzo.in/api/home-display/save",
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
          data.message ||
            "Saved Successfully"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed To Save"
        );
      }
    }
  );

// ======================
// START
// ======================

createBoxes();

loadData();