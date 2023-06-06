function myFunction() {
    var h = document.getElementById("header");
    var x = document.getElementById("nav-button-links");
    if (x.style.display === "block") {
      x.style.display = "none";
      h.style.backgroundColor = "rgba(132, 142, 151, 0.5)";
    } else {
      x.style.display = "block";
      h.style.backgroundColor = "rgba(132, 142, 151, 0.9)";
    }
}