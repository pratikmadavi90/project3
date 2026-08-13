const featuredContainer =
  document.getElementById(
    "featuredContainer"
  );

const personalCareContainer =
  document.getElementById(
    "personalCareContainer"
  );

const householdContainer =
  document.getElementById(
    "householdContainer"
  );

const featuredTemplate =
  document.getElementById(
    "featuredTemplate"
  );

const itemTemplate =
  document.getElementById(
    "itemTemplate"
  );

// ======================
// ADD FEATURED
// ======================

document
  .getElementById(
    "addFeaturedBtn"
  )
  .addEventListener(
    "click",
    () => {
      const clone =
        featuredTemplate.content.cloneNode(
          true
        );

      clone
        .querySelector(
          ".delete-btn"
        )
        .addEventListener(
          "click",
          (e) => {
            e.target
              .closest(".card")
              .remove();
          }
        );

      featuredContainer.appendChild(
        clone
      );
    }
  );

// ======================
// ADD PERSONAL CARE
// ======================

document
  .getElementById(
    "addPersonalBtn"
  )
  .addEventListener(
    "click",
    () => {
      const clone =
        itemTemplate.content.cloneNode(
          true
        );

      clone
        .querySelector(
          ".delete-btn"
        )
        .addEventListener(
          "click",
          (e) => {
            e.target
              .closest(".card")
              .remove();
          }
        );

      personalCareContainer.appendChild(
        clone
      );
    }
  );

// ======================
// ADD HOUSEHOLD
// ======================

document
  .getElementById(
    "addHouseholdBtn"
  )
  .addEventListener(
    "click",
    () => {
      const clone =
        itemTemplate.content.cloneNode(
          true
        );

      clone
        .querySelector(
          ".delete-btn"
        )
        .addEventListener(
          "click",
          (e) => {
            e.target
              .closest(".card")
              .remove();
          }
        );

      householdContainer.appendChild(
        clone
      );
    }
  );

// ======================
// SAVE DATA (S3 READY)
// ======================

document
  .getElementById("saveBtn")
  .addEventListener(
    "click",
    async () => {
      try {

        const formData =
          new FormData();

        const featured = [];

        document
          .querySelectorAll(
            "#featuredContainer .card"
          )
          .forEach(
            (card, index) => {

              featured.push({
                title:
                  card.querySelector(
                    ".title-input"
                  )?.value || "",

                category:
                  card.querySelector(
                    ".category-input"
                  )?.value || "",
              });

              const img1 =
                card.querySelector(
                  ".image1"
                )?.files?.[0];

              const img2 =
                card.querySelector(
                  ".image2"
                )?.files?.[0];

              const img3 =
                card.querySelector(
                  ".image3"
                )?.files?.[0];

              const img4 =
                card.querySelector(
                  ".image4"
                )?.files?.[0];

              if (img1)
                formData.append(
                  `featured_${index}_image_0`,
                  img1
                );

              if (img2)
                formData.append(
                  `featured_${index}_image_1`,
                  img2
                );

              if (img3)
                formData.append(
                  `featured_${index}_image_2`,
                  img3
                );

              if (img4)
                formData.append(
                  `featured_${index}_image_3`,
                  img4
                );
            }
          );

        const personalCare =
          [];

        document
          .querySelectorAll(
            "#personalCareContainer .card"
          )
          .forEach(
            (card, index) => {

              personalCare.push({
                name:
                  card.querySelector(
                    ".name-input"
                  )?.value || "",

                category:
                  card.querySelector(
                    ".category-input"
                  )?.value || "",

                subCategory:
                  card.querySelector(
                    ".subcategory-input"
                  )?.value || "",
              });

              const image =
                card.querySelector(
                  ".image-input"
                )?.files?.[0];

              if (image) {
                formData.append(
                  `personalCare_${index}_image`,
                  image
                );
              }
            }
          );

        const household =
          [];

        document
          .querySelectorAll(
            "#householdContainer .card"
          )
          .forEach(
            (card, index) => {

              household.push({
                name:
                  card.querySelector(
                    ".name-input"
                  )?.value || "",

                category:
                  card.querySelector(
                    ".category-input"
                  )?.value || "",

                subCategory:
                  card.querySelector(
                    ".subcategory-input"
                  )?.value || "",
              });

              const image =
                card.querySelector(
                  ".image-input"
                )?.files?.[0];

              if (image) {
                formData.append(
                  `household_${index}_image`,
                  image
                );
              }
            }
          );

        formData.append(
          "featured",
          JSON.stringify(
            featured
          )
        );

        formData.append(
          "personalCare",
          JSON.stringify(
            personalCare
          )
        );

        formData.append(
          "household",
          JSON.stringify(
            household
          )
        );

        const token =
          localStorage.getItem(
            "token"
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