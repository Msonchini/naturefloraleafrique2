/* =====================================================================
   NATURE FLORALE AFRIQUE - Menu sur téléphone et tablette
   Le bouton à trois traits ouvre et ferme la liste des pages.
   Ce script est utilisé par toutes les pages.
   ===================================================================== */

(function () {

  var entete = document.getElementById("entete");
  var bouton = document.getElementById("burger");
  if (!entete || !bouton) return;

  // Ouvre (true) ou ferme (false) le menu
  function basculer(ouvert) {
    entete.classList.toggle("ouvert", ouvert);
    bouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
    bouton.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
  }

  // Clic sur le bouton : ouvre ou ferme
  bouton.addEventListener("click", function () {
    basculer(!entete.classList.contains("ouvert"));
  });

  // Clic sur un lien du menu : on referme (utile pour les liens vers la même page)
  document.querySelectorAll("#menu a").forEach(function (lien) {
    lien.addEventListener("click", function () { basculer(false); });
  });

  // Touche Échap : ferme le menu
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") basculer(false);
  });

  // Clic en dehors de l'en-tête : ferme le menu
  document.addEventListener("click", function (e) {
    if (!entete.contains(e.target)) basculer(false);
  });

  // Si l'écran devient grand (ex. tablette tournée), on remet le menu à zéro
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) basculer(false);
  });

})();
