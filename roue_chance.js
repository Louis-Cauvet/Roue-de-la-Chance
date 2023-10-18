"use strict";

const saisiePropositions = document.getElementById("champPropositions");
const zoneRoue = document.getElementById("zoneRoue");
const roue = document.getElementById("roue").getContext("2d");
let graphiqueRoue = null;
const valeurFinale = document.getElementById("valeurFinale");

saisiePropositions.addEventListener("input", () =>{
    // on récupère le texte saisi par l'utilisateur dans le textarea
    let texteSaisi = saisiePropositions.value;

    // on sépare le texte saisi en plusieurs morceaux selon les sauts de ligne, et on stocke tous ces morceaux dans un tableau "tabLignes" 
    const tabLignes = texteSaisi.split("\n");

    // on appelle la fonction "supprimerLignesVides" afin d'enlever du tableau les lignes qui ne possèdent aucun caractère
    const tabSansVides = supprimerLignesVides(tabLignes);

    // on récupère le nombre de ligne que possède le tableau débarassé de ses lignes inutiles
    let nbLignes = tabSansVides.length;

    if(nbLignes > 0){
        zoneRoue.style.display = "flex";
        // on appelle la fonction "construireRoue" afin de construire le graphique qui servira de roue, puis l'afficher
        construireRoue(tabSansVides, nbLignes);
    } else {
        zoneRoue.style.display = "none";
        graphiqueRoue.destroy();
    }
});


function supprimerLignesVides(tableau){
    // on initialise le tableau qui sera renvoyé en sortie de la fonction
    const tableauSortie = new Array;

    //on parcourt chaque ligne du tableau passé en paramètres
    for (let index=0; index<tableau.length; index++){
        // on supprime les espaces au début et à la fin de la ligne, qui ne sont pas compris comme des caractères
        let ligneSansEspace = tableau[index].trim();

        // si la ligne possède au moins 1 caractère (n'est donc pas vide), on l'ajoute dans le tableau de sortie
        if(ligneSansEspace.length > 0){
            tableauSortie.push(ligneSansEspace);
        }
    }

    return tableauSortie;
}


// cette fonction permet d'afficher le graphique constituant la roue, selon les éléments stockés dans le tableau passé en paramètres
function construireRoue(tableau, nb){
    // si un graphique existe déja, on le détruit pour en réafficher 1
    if(graphiqueRoue != null){
        graphiqueRoue.destroy();
    }

    // on appelle la fonction "obtenirEtiquettesParties" afin de récupérer un tableau qui contient la valeur à afficher sur chaque partie de la roue
    const tabEtiquettesParties = obtenirEtiquettesParties(tableau, nb);

    // on appelle la fonction "obtenirValeursParties" afin de récupérer un tableau qui contient les valeurs de chaque partie de la roue
    const tabValeursParties = obtenirValeursParties(tabEtiquettesParties, nb);

    // on appelle la fonction "obtenirTaillesParties" afin de récupérer un tableau qui contient la proportion en taille de chaque partie de la roue
    const tabTaillesParties = obtenirTaillesParties(nb);

    // on appelle la fonction "obtenirTaillesParties" afin de récupérer un tableau qui contient la couleur de chaque partie de la roue
    const tabCouleursParties = obtenirCouleursParties(nb);

    // on construit le graphique à l'aide des tableaux précédemment récoltés 
    graphiqueRoue = new Chart(roue, {
        // plugin qui permet d'afficher du texte par dessus le graphique
        plugins: [ChartDataLabels],
        // type de graphique
        type: "pie",
        data: {
            // on récupère les étiquettes qu'on a stockées dans le tableau "tabEtiquettesParties"
            labels: tabEtiquettesParties,
            // paramètres pour les données et le graphique
            datasets: [{
                // on récupère les couleurs qu'on a stockées dans le tableau "tabCouleursParties"
                backgroundColor: tabCouleursParties,
                // on récupère les tailles de chaque partie qu'on a stockées dans le tableau "tabTaillesParties "
                data: tabTaillesParties
            }],
        },
        options: {
            // graphique responsive
            responsive: true,
            // pas d'animation sur le graphique
            animation: {duration: 0},
            // plugin qui permet de gérer l'aspect du graphique
            plugins: {
                // on cache la légende du graphique et l'affichage au survol
                tooltip: false,
                legend: {
                    display: false,
                },
                // on définit les caractéristiques des écritures qui apparaissent par dessus le graphique
                datalabels: {
                    anchor: "end",
                    align: "start",
                    offset: 10,
                    color: "#e9e7e7",
                    font: { size: 14 },
                    // on affiche sur le graphique le contenu de chaque données, et non sa taille
                    formatter: (_,context) => context.chart.data.labels[context.dataIndex],
                },
            },
        },
    });

    let boutonRoue = document.getElementById("boutonRoue");
    boutonRoue.addEventListener("click", () =>{
        lancerRoue(tabValeursParties);
    });
}

// cette fonction permet d'obtenir un tableau contenant les valeurs de chaque partie de la roue en fonction du nombre passé en paramètres
function obtenirEtiquettesParties(tableau, nb){
    const tabEtiquettesParties = new Array;

    for (let index=0; index<nb; index++){
        tabEtiquettesParties.push(tableau[index]);
    }

    return tabEtiquettesParties;
}


// cette fonction permet d'obtenir un tableau contenant les valeurs de chaque partie de la roue en fonction du nombre passé en paramètres
function obtenirValeursParties(tableau, nb){
    const tabValeursParties = new Array;
    let min = 0;
    let max = 360/nb;
    // cette variable prend pour valeur l'écart en degré entre 2 parties
    const ecartParties = max;

    // selon le nombre passé en paramètres, on affecte à chaque partie de la roue un degré minimum, un degré maximum et sa valeur 
    for (let index=0; index<nb; index++){
        const nvPartie = {
            degreMin : min,
            degreMax : max,
            valeur : tableau[index]
        }
        
        // on ajoute les données de la partie obtenues dans le tableau qui sera retourné en fin de fonction
        tabValeursParties.push(nvPartie);
        // puis on augmente les valeurs de "min" et de "max" de l'écart en degré défini plus haut
        min += ecartParties;
        if(index == 0){
            min += 1;
        }
        max += ecartParties;
    }

    return tabValeursParties;
}


// cette fonction permet d'obtenir un tableau contenant la proportion de chaque partie de la roue en fonction du nombre passé en paramètres
function obtenirTaillesParties(nb){
    const tabTaillesParties = new Array;

    // on indique "1" pour la taille de chaque partie, afin qu'elles occupent toutes le même espace dans la roue (n'importe quelle valeur conviendrait, du moment que c'est la même partout)
    for (let index=0; index<nb; index++){
        tabTaillesParties.push(1);
    }

    return tabTaillesParties;
}


// cette fonction permet d'obtenir un tableau contenant la couleur de chaque partie de la roue en fonction du nombre passé en paramètres
function obtenirCouleursParties(nb){
    const tabCouleursParties = new Array;

    let compteur = 1;
    // selon la valeur du compteur, on ajoute dans le tableau de sortie une des couleurs prédéfinies pour la roue (voir la racine de la feuille CSS)
    for (let index=1; index<=nb; index++){

        switch(compteur){
            case 1 :
                tabCouleursParties.push("#481263");
                break;
            case 2 :
                tabCouleursParties.push("#770dac");
                break;
            case 3 :
                tabCouleursParties.push("#bd69e7");
                break;
            case 4 :
                tabCouleursParties.push("#964bbb");
                break;
            default:
                tabCouleursParties.push("#964bbb");
        }

        // si le compteur atteint 3, on le réinitialise à 1 car il n'y a que 3 couleurs différentes
        if(compteur == 4){
            compteur = 2;
        } else {
            compteur ++;
        }
    }

    return tabCouleursParties;
}

// fonction s'éxécutant lorsqu'on appuie sur le bouton afind e faire tourner la roue
function lancerRoue(tab){
    debutRoue();

    // on génère un nombre aléatoire entre 0 et 360 degrés
    let degreAleatoire = Math.floor(Math.random() * (360 - 0 +1) + 0); 

    const roueTourne = document.getElementById("roue");
    // on calcule le nombre de degrés que doit tourner la roue en fonction du nombre de tours que l'on souhaite (ici 25), ainsi que du degré aléatoire généré 
    let nbDegresTotal = 25*360-degreAleatoire;
    roueTourne.style.transition = "all 8s ease-in-out";
    roueTourne.style.transform = "rotate("+nbDegresTotal+"deg)";

    // on effectue un setTimeout afin d'attendre la fin de la rotation de la roue avant d'afficher le résultat
    setTimeout(()=>{
        // en fonction de l'angle généré aléatoirement, on affiche le résultat pointé par la flèche (située à 90 degrés sur la droite de la roue)
        if(degreAleatoire > 270){
            afficherValeur(degreAleatoire-270, tab);
        }else{
            afficherValeur(90+degreAleatoire, tab);
        }
        finRoue()
    }, 8000)

}

// cette fonction permet de configurer l'affichage des éléments de la page lorsque la roue commence à tourner
function debutRoue(){
    // on fait disparaître le bouton qui permet de tourner la roue
    const boutonRoue = document.getElementById("boutonRoue");
    boutonRoue.style.display = "none";

    // on empêche la saisie de nouvelles données par l'utilisateur tant que la roue n'a pas fini de tourner
    saisiePropositions.setAttribute("disabled", "true");

    // on affiche un texte dans la zone qui prendra la valeur finale une fois la roue arrêtée
    valeurFinale.innerHTML = "C'est parti !!";
    valeurFinale.style.display = "block";

    // on anime la flèche de la roue afin qu'elle bouge lorsqu'on fait tourner la roue
    const flecheRoue = document.getElementsByClassName("fa-location-arrow")[0];
    flecheRoue.animate(
        [
            {transform: "rotate(225deg)"},
            {transform: "rotate(205deg)"},
            {transform: "rotate(245deg)"},
            {transform: "rotate(225deg)"},
        ],
        {
            duration: 500,
            iterations: 16,
        },
    );
}

// cette fonction permet de configurer l'affichage des éléments de la page lorsque la roue s'arrête
function finRoue(){
    setTimeout(()=>{
        // on fait réapparaître le bouton qui permet de tourner la roue
        const boutonRoue = document.getElementById("boutonRoue");
        boutonRoue.style.display = "block";

        // on autorise à nouveau l'utilisateur à saisir des propositions dans le champ de saisie
        saisiePropositions.removeAttribute("disabled");

        const roueTourne = document.getElementById("roue");
        roueTourne.style.transition = "none";
        roueTourne.style.transform = "rotate(0deg)";
    }, 1500)
}

// fonction qui permet d'afficher la valeur finale une fois que la roue a fini de tourner
function afficherValeur(angleFin, tableau){
    for(let zonePartie of tableau){
        if(angleFin >= zonePartie.degreMin && angleFin <= zonePartie.degreMax){
            valeurFinale.innerHTML = zonePartie.valeur;
        }
    }
    valeurFinale.style.display = "block";
}
