/* =====================================================================
   NATURE FLORALE AFRIQUE - SCRIPT (app.js)
   Ce fichier fait deux choses :
   1) les boutons "Copier" de la page Contact ;
   2) le formulaire de devis : il écrit le message et prépare le lien WhatsApp.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- A MODIFIER : numéro WhatsApp qui reçoit les demandes ----------
     Format : indicatif du pays + numéro, sans "+" ni espaces.
     Exemple actuel : 229 (Bénin) + 0196036942 */
  var NUMERO_WHATSAPP = '2290196036942';

  /* ---------- Boutons "Copier" (page Contact) ----------
     Chaque bouton contient l'attribut data-copy="texte à copier" dans le HTML. */
  function activerBoutonsCopier() {
    var boutons = document.querySelectorAll('.copy');
    boutons.forEach(function (bouton) {
      bouton.addEventListener('click', function () {
        var texte = bouton.getAttribute('data-copy');
        var zone = bouton.parentElement.querySelector('.val');

        function fini(ok) {
          // Si la copie automatique est refusée, on sélectionne le texte pour copier à la main
          if (!ok && zone) {
            var plage = document.createRange();
            plage.selectNodeContents(zone);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(plage);
          }
          bouton.textContent = ok ? 'Copié' : 'Sélectionné';
          setTimeout(function () { bouton.textContent = 'Copier'; }, 1800);
        }

        try {
          navigator.clipboard.writeText(texte).then(
            function () { fini(true); },
            function () { fini(false); }
          );
        } catch (e) {
          fini(false);
        }
      });
    });
  }

  /* ---------- Formulaire de devis (page Contact) ---------- */
  function activerFormulaire() {
    var formulaire = document.getElementById('devis');
    var lien = document.getElementById('wa');
    if (!formulaire || !lien) { return; } // pas de formulaire sur cette page

    // Lit la valeur d'un champ à partir de son identifiant (id) dans le HTML
    function valeur(id) {
      return (document.getElementById(id).value || '').trim();
    }

    // Construit le message puis met à jour le lien WhatsApp
    function preparerMessage() {
      var lignes = ['Bonjour Nature Florale Afrique, je souhaite un devis.'];
      if (valeur('nom')) { lignes.push('Nom : ' + valeur('nom')); }
      if (valeur('lieu')) { lignes.push('Lieu : ' + valeur('lieu')); }
      lignes.push('Travaux : ' + valeur('service'));
      if (valeur('msg')) { lignes.push('Projet : ' + valeur('msg')); }
      lien.href = 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + encodeURIComponent(lignes.join('\n'));
    }

    // Le message est refait à chaque modification d'un champ
    formulaire.addEventListener('input', preparerMessage);
    formulaire.addEventListener('change', preparerMessage);
    // On empêche l'envoi classique du formulaire : tout passe par WhatsApp
    formulaire.addEventListener('submit', function (e) { e.preventDefault(); });
    preparerMessage();
  }

  activerBoutonsCopier();
  activerFormulaire();
})();
