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
// SAVE DATA
// ======================

document
  .getElementById(
    "saveBtn"
  )
  .addEventListener(
    "click",
    async () => {
      try {
        const featured = [];

        document
          .querySelectorAll(
            "#featuredContainer .card"
          )
          .forEach((card) => {
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
          });

        const personalCare =
          [];

        document
          .querySelectorAll(
            "#personalCareContainer .card"
          )
          .forEach((card) => {
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
          });

        const household =
          [];

        document
          .querySelectorAll(
            "#householdContainer .card"
          )
          .forEach((card) => {
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
          });

        const response =
          await fetch(
            "https://api.harzo.in/api/home-display/save",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                featured,
                personalCare,
                household,
              }),
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
          "Failed to Save"
        );
      }
    }
  );