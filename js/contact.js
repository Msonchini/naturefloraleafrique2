/* =====================================================================
   NATURE FLORALE AFRIQUE - Script de la page Contact
   Deux fonctions :
   1. Préparer le message WhatsApp à partir du formulaire de devis.
   2. Copier un numéro ou l'e-mail avec le bouton "Copier".
   ===================================================================== */

(function () {

  /* -------------------------------------------------------------------
     1. FORMULAIRE : construction du lien WhatsApp
     ------------------------------------------------------------------- */

  var NUMERO_WHATSAPP = "2290196036942";   // numéro de l'entreprise, sans le "+"

  var formulaire = document.getElementById("devis");
  var boutonWhatsApp = document.getElementById("wa");

  // Lit la valeur d'un champ et enlève les espaces autour
  function valeur(id) {
    return document.getElementById(id).value.trim();
  }

  // Écrit le message et l'ajoute au lien du bouton WhatsApp
  function preparerMessage() {
    var texte = "Bonjour Nature Florale Afrique, je souhaite un devis.";

    if (valeur("nom"))  texte += "\nNom : " + valeur("nom");
    if (valeur("lieu")) texte += "\nLieu : " + valeur("lieu");
    texte += "\nTravaux : " + document.getElementById("type").value;
    if (valeur("msg"))  texte += "\nProjet : " + valeur("msg");

    boutonWhatsApp.href =
      "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(texte);
  }

  // Met le message à jour à chaque fois que le visiteur écrit dans un champ
  formulaire.addEventListener("input", preparerMessage);

  // Le formulaire n'envoie rien tout seul : le visiteur utilise le bouton WhatsApp
  formulaire.addEventListener("submit", function (e) {
    e.preventDefault();
  });

  // Prépare un premier message dès l'ouverture de la page
  preparerMessage();


  /* -------------------------------------------------------------------
     2. BOUTONS "COPIER"
     ------------------------------------------------------------------- */

  // Plan B : sélectionne le texte pour que le visiteur le copie lui-même
  function selectionner(bouton) {
    var texte = bouton.parentNode.querySelector("strong");
    if (texte) {
      var zone = document.createRange();
      zone.selectNodeContents(texte);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(zone);
    }
  }

  var boutonsCopier = document.querySelectorAll(".copy");

  boutonsCopier.forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      var ancienTexte = bouton.textContent;

      // Affiche "Copié" pendant un court instant
      function confirmer() {
        bouton.textContent = "Copié";
        setTimeout(function () { bouton.textContent = ancienTexte; }, 1600);
      }

      try {
        navigator.clipboard
          .writeText(bouton.getAttribute("data-copy"))
          .then(confirmer, function () { selectionner(bouton); });
      } catch (erreur) {
        selectionner(bouton);
      }
    });
  });

})();
