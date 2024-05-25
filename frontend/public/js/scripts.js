/* DOMContentLoaded */
document.addEventListener("DOMContentLoaded", main);

/* main() FUNCTION */

function main() {
  // theme-switcher
  document
    .getElementById("theme-switcher")
    .addEventListener("click", function () {
      document.querySelector("body").classList.toggle("light");
      const themeImg = this.children[0];
      themeImg.setAttribute(
        "src",
        themeImg.getAttribute("src") === "/images/icon-sun.svg"
          ? "/images/icon-moon.svg"
          : "/images/icon-sun.svg",
      );
    });
}
