/* =====================================================================
   NATURE FLORALE AFRIQUE - Script de la page Réalisations
   Deux fonctions :
   1. Filtrer les projets par catégorie (boutons au-dessus de la liste).
   2. Ouvrir une visionneuse avec toutes les photos d'un projet.
   ===================================================================== */

(function () {

  var DOSSIER = "images/realisations/";   // dossier où se trouvent les photos


  /* -------------------------------------------------------------------
     1. FILTRES PAR CATÉGORIE
     ------------------------------------------------------------------- */

  var boutons = document.querySelectorAll(".fbtn");
  var cartes = document.querySelectorAll(".pc");

  // Affiche seulement les cartes de la catégorie choisie ("tout" = toutes)
  function filtrer(categorie) {
    boutons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-filtre") === categorie ? "true" : "false");
    });
    cartes.forEach(function (c) {
      c.hidden = !(categorie === "tout" || c.getAttribute("data-cat") === categorie);
    });
  }

  boutons.forEach(function (b) {
    b.addEventListener("click", function () {
      filtrer(b.getAttribute("data-filtre"));

      // Sur téléphone : remonte au début de la liste pour voir les résultats
      var liste = document.querySelector(".pgrid");
      var barre = document.querySelector(".filters");
      var haut = liste.getBoundingClientRect().top;
      var decalage = barre.getBoundingClientRect().height + 100;
      if (haut < decalage) {
        window.scrollTo({ top: window.pageYOffset + haut - decalage, behavior: "smooth" });
      }
    });
  });

  // Un lien comme realisations.html#etudes ouvre directement cette catégorie
  var depart = (location.hash || "").replace("#", "");
  if (depart) {
    var existe = Array.prototype.some.call(boutons, function (b) {
      return b.getAttribute("data-filtre") === depart;
    });
    if (existe) filtrer(depart);
  }


  /* -------------------------------------------------------------------
     2. VISIONNEUSE DE PHOTOS
     ------------------------------------------------------------------- */

  var fenetre = document.getElementById("lb");
  var image = document.getElementById("lb-img");
  var titre = document.getElementById("lb-titre");
  var client = document.getElementById("lb-client");
  var position = document.getElementById("lb-pos");
  var vignettes = document.getElementById("lb-thumbs");

  var photos = [];       // liste des photos du projet ouvert
  var courante = 0;      // numéro de la photo affichée
  var boutonOuvert = null;

  // Affiche la photo numéro n
  function afficher(n) {
    courante = (n + photos.length) % photos.length;
    image.src = DOSSIER + photos[courante];
    image.alt = titre.textContent + ", photo " + (courante + 1);
    position.textContent = "Photo " + (courante + 1) + " sur " + photos.length;
    Array.prototype.forEach.call(vignettes.children, function (v, i) {
      v.setAttribute("aria-current", i === courante ? "true" : "false");
    });
    var actif = vignettes.children[courante];
    if (actif && actif.scrollIntoView) {
      try { actif.scrollIntoView({ block: "nearest", inline: "center" }); } catch (e) {}
    }
  }

  // Ouvre la visionneuse pour le bouton d'une carte
  function ouvrir(bouton) {
    boutonOuvert = bouton;
    photos = bouton.getAttribute("data-photos").split(",");
    titre.textContent = bouton.getAttribute("data-titre");
    // Sous-titre et client sur la même ligne
    client.textContent = [bouton.getAttribute("data-sous"), bouton.getAttribute("data-client")]
      .filter(Boolean).join(" · ");

    // Petites vignettes sous la grande photo (seulement s'il y a plusieurs photos)
    vignettes.innerHTML = "";
    if (photos.length > 1) {
      photos.forEach(function (nom, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Voir la photo " + (i + 1));
        var mini = document.createElement("img");
        mini.src = DOSSIER + nom;
        mini.alt = "";
        b.appendChild(mini);
        b.addEventListener("click", function () { afficher(i); });
        vignettes.appendChild(b);
      });
    }
    document.getElementById("lb-prev").hidden = photos.length < 2;
    document.getElementById("lb-next").hidden = photos.length < 2;

    fenetre.hidden = false;
    document.body.style.overflow = "hidden";   // empêche la page de défiler derrière
    afficher(0);
    document.getElementById("lb-x").focus();
  }

  function fermer() {
    fenetre.hidden = true;
    document.body.style.overflow = "";
    if (boutonOuvert) boutonOuvert.focus();     // redonne le focus à la carte
  }

  document.querySelectorAll(".pc-open").forEach(function (b) {
    b.addEventListener("click", function () { ouvrir(b); });
  });

  document.getElementById("lb-x").addEventListener("click", fermer);
  document.getElementById("lb-prev").addEventListener("click", function () { afficher(courante - 1); });
  document.getElementById("lb-next").addEventListener("click", function () { afficher(courante + 1); });

  // Cliquer à côté de la photo ferme la visionneuse
  fenetre.addEventListener("click", function (e) {
    if (e.target === fenetre) fermer();
  });

  // Clavier : Échap ferme, flèches changent de photo
  document.addEventListener("keydown", function (e) {
    if (fenetre.hidden) return;
    if (e.key === "Escape") fermer();
    if (e.key === "ArrowLeft") afficher(courante - 1);
    if (e.key === "ArrowRight") afficher(courante + 1);
  });

  // Téléphone : glisser le doigt vers la gauche ou la droite change de photo
  var departX = null;
  image.addEventListener("touchstart", function (e) { departX = e.touches[0].clientX; }, { passive: true });
  image.addEventListener("touchend", function (e) {
    if (departX === null) return;
    var delta = e.changedTouches[0].clientX - departX;
    if (Math.abs(delta) > 40) afficher(courante + (delta < 0 ? 1 : -1));
    departX = null;
  });

})();
