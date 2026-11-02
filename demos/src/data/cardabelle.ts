// Content taken from www.domaine-lacardabelle.eu (crawled 2026-11-02). Photos are the owners' own.
// Most of their photos are small (about 300 px wide): designs must show them at small sizes.
import type { Bnb } from './types';

import vineyardCliff from '../assets/cardabelle/vue-chateau-vigne-comp.jpg';
import peyrelade from '../assets/cardabelle/vue-chateau-comp.jpg';
import housePool from '../assets/cardabelle/vuemaison.jpg';
import pool from '../assets/cardabelle/r100001.jpg';
import valley from '../assets/cardabelle/r100003.jpg';
import grapes from '../assets/cardabelle/vigne-foto.jpg';
import barrels from '../assets/cardabelle/barriques.jpg';
import cellarDoor from '../assets/cardabelle/cave-exter-comp.jpg';
import cellar from '../assets/cardabelle/cave-inter-comp.jpg';
import dinnerTable from '../assets/cardabelle/table.jpg';
import diningRoom from '../assets/cardabelle/salle.jpg';
import tomatoes from '../assets/cardabelle/tomate.jpg';
import peaches from '../assets/cardabelle/peches.jpg';
import peachBranch from '../assets/cardabelle/peches1.jpg';
import cerise from '../assets/cardabelle/cerise.jpg';
import figue from '../assets/cardabelle/figue.jpg';
import mirabelle from '../assets/cardabelle/mirabelle1.jpg';
import room4 from '../assets/cardabelle/ch4.jpg';
import room1 from '../assets/cardabelle/ch1.jpg';
import gite1 from '../assets/cardabelle/gite-ext1.jpg';
import giteCourtyard from '../assets/cardabelle/cour.jpg';
import giteLiving from '../assets/cardabelle/g121.jpg';
import giteKitchen from '../assets/cardabelle/g122.jpg';
import giteTerrace from '../assets/cardabelle/gg121.jpg';
import giteBedroom from '../assets/cardabelle/chambre1g12.jpg';
import giteBedroom2 from '../assets/cardabelle/chambre2.jpg';
import giteKitchen2 from '../assets/cardabelle/cuisine.jpg';

export const cardabelle: Bnb = {
  slug: 'cardabelle',
  name: 'Domaine de la Cardabelle',
  tagline: "Chambres d'hôtes et gîtes sur une petite exploitation viticole, à l'entrée des gorges du Tarn",
  intro:
    "À l'entrée des gorges du Tarn, au cœur du Parc naturel régional des Grands Causses, nous vous accueillons dans une maison en pierre au pied des falaises, des vignes et des vergers en coteaux. Originaires de la région, nous vous proposons 5 chambres d'hôtes sur notre petite exploitation viticole et arboricole, dans le village de Rivière-sur-Tarn. Chaque chambre, à l'étage avec escalier indépendant, a sa salle d'eau avec douche et WC privés, et une vue sur les coteaux, la vallée du Tarn ou le rocher de Peyrelade.",
  heroPhotos: [
    { src: vineyardCliff, alt: 'Les vignes du domaine au pied du rocher de Peyrelade' },
    { src: peyrelade, alt: 'Le rocher et le château de Peyrelade au-dessus de la vallée' },
  ],
  highlights: [
    {
      title: 'La piscine',
      text: 'La maison domine une piscine, ouverte du 15 juin au 15 septembre, très appréciée après une journée bien remplie. Pétanque et ping-pong pour les grands, balançoire, toboggan et trampoline pour les enfants.',
      photos: [
        { src: pool, alt: 'La piscine du domaine entourée de vignes' },
        { src: housePool, alt: 'La maison en pierre au-dessus de la piscine' },
      ],
    },
    {
      title: "La table d'hôtes",
      text: "La maîtresse de maison cuisine de bons petits plats avec les légumes du jardin : grillades, civet de lapin, volailles, gigot de mouton. En dessert, tartes, clafoutis et flaune. À la saison des cerises, on prend le dessert sous l'arbre. Le dîner est servi sur la terrasse ou dans la salle à manger ; au petit déjeuner, confitures maison, miel, amandes et noix selon la saison.",
      photos: [
        { src: dinnerTable, alt: "La table d'hôtes dressée pour le petit déjeuner" },
        { src: diningRoom, alt: 'La salle à manger' },
        { src: tomatoes, alt: 'Tomates du jardin' },
        { src: peaches, alt: 'Pêches du verger' },
        { src: peachBranch, alt: 'Branche de pêches mûres' },
      ],
    },
    {
      title: 'Le vignoble',
      text: "Delphine et Ludovic cultivent avec passion leurs parcelles en coteaux, plantées de gamay, syrah et cabernet, dont l'assemblage donne les Côtes de Millau rouge et rosé, pressés à l'ancienne. Après le dîner, on vous invite à la cave pour un verre et l'histoire du vin. Nouveauté : le Finou, apéritif au rosé et aux fruits rouges du domaine.",
      photos: [
        { src: grapes, alt: 'Grappes de raisin noir dans les vignes du domaine' },
        { src: cellarDoor, alt: "L'entrée voûtée de la cave" },
        { src: barrels, alt: 'Les barriques dans la cave en pierre' },
        { src: cellar, alt: 'La cave de dégustation' },
      ],
    },
    {
      title: 'Les gîtes Le Lilas et L’Hirondelle',
      text: "Deux gîtes ruraux dans le village de Rivière-sur-Tarn, à 300 mètres de la maison, pour 4 à 5 personnes. Cuisine (lave-vaisselle à L'Hirondelle), séjour avec télévision, salle d'eau avec lave-linge, 2 chambres avec lit double, dont une avec lit d'appoint. Terrasse ou cour avec salon de jardin pour manger dehors.",
      photos: [
        { src: gite1, alt: 'Façade en pierre du gîte et son escalier' },
        { src: giteTerrace, alt: 'La terrasse ombragée du gîte' },
        { src: giteCourtyard, alt: 'La cour pavée du gîte' },
        { src: giteLiving, alt: 'Le séjour du gîte' },
        { src: giteKitchen, alt: 'La cuisine du gîte' },
        { src: giteKitchen2, alt: 'Coin repas du second gîte' },
        { src: giteBedroom, alt: 'Chambre du gîte' },
        { src: giteBedroom2, alt: 'Seconde chambre du gîte' },
      ],
    },
  ],
  gallery: [
    { src: peyrelade, alt: 'Le rocher de Peyrelade' },
    { src: valley, alt: 'La vallée du Tarn et le village' },
    { src: housePool, alt: 'La maison et la piscine' },
    { src: grapes, alt: 'Les vignes' },
    { src: peaches, alt: 'Le verger' },
  ],
  practical: [
    'Fermé en janvier et février. En novembre et décembre, ouvert uniquement les week-ends.',
    'De mi-juillet à mi-août : 2 nuits minimum.',
    'Arrivées à partir de 16 h, départs à 10 h au plus tard.',
    'Parking privé. Accueil de groupes possible.',
    'Paiement par chèque, chèques vacances, espèces ou virement.',
  ],
  url: 'https://www.domaine-lacardabelle.eu/',
  hosts: 'Delphine Meljac',
  phone: '05 65 59 85 78',
  email: 'domainedelacardabelle@orange.fr',
  address: { street: '5 chemin du Roc de Peyrelade', postalCode: '12640', locality: 'Rivière-sur-Tarn' },
  google: { rating: 4.8, reviews: 105 },
  labels: ['Gîtes de France 2 épis', 'Bienvenue à la ferme'],
  seo: {
    title: "Domaine de la Cardabelle, chambres d'hôtes et gîtes – Rivière-sur-Tarn",
    description:
      "Chambres d'hôtes avec piscine et table d'hôtes sur un domaine viticole familial à Rivière-sur-Tarn, à l'entrée des gorges du Tarn, à 12 km de Millau. Deux gîtes pour 4 à 5 personnes.",
  },
  amenities: ['Piscine', 'Table d’hôtes', 'Petit déjeuner inclus', 'Parking privé', 'Jeux pour enfants'],
  checkIn: '16:00',
  checkOut: '10:00',
  rooms: [
    // Bed layouts read from the photos (site only says: four rooms for 2, one for 3). Owner to confirm.
    { name: 'Cerise', summary: 'Un lit double et un lit simple, jusqu’à 3 personnes.', photos: [{ src: cerise, alt: 'La chambre Cerise' }] },
    { name: 'Figue', summary: 'Lit double.', photos: [{ src: figue, alt: 'La chambre Figue' }] },
    { name: 'Mirabelle', summary: 'Lit double.', photos: [{ src: mirabelle, alt: 'La chambre Mirabelle' }] },
    { name: 'Chambre aux lits jumeaux', summary: 'Deux lits simples.', photos: [{ src: room1, alt: 'Chambre à lits jumeaux' }] },
    { name: 'Chambre double', summary: 'Lit double.', photos: [{ src: room4, alt: 'Chambre avec lit double' }] },
  ],
  prices: [
    {
      title: 'Chambres d’hôtes, petit déjeuner compris',
      columns: ['1 nuit', 'Séjour plus long'],
      rows: [
        { label: '1 personne', values: ['47 €', '45 € dès 2 nuits'] },
        { label: '2 personnes', values: ['56 €', '52 € dès 3 nuits'] },
        { label: '3 personnes', values: ['65 €', '63 € dès 2 nuits'] },
      ],
      notes: [
        "Dîner à la table d'hôtes : 19,80 €, apéritif offert, vin du domaine en supplément. Pas de table d'hôtes le dimanche.",
        'Taxe de séjour : 0,66 € par jour et par adulte.',
      ],
    },
    {
      title: 'Gîtes ruraux',
      columns: ['La semaine'],
      rows: [
        { label: 'Très haute saison', values: ['530 €'] },
        { label: 'Haute saison', values: ['500 €'] },
        { label: 'Moyenne saison', values: ['360 €'] },
      ],
      notes: ['Week-ends : 160 € (2 nuits), 220 € (3 nuits), 250 € (4 nuits).'],
    },
  ],
  bookingTerms: [],
  directions: [
    {
      from: 'Depuis le nord (A75, Clermont-Ferrand)',
      steps:
        'Sortie 44.1 Aguessac – Gorges du Tarn. À Aguessac, à gauche vers les gorges du Tarn par la D907. Traverser Rivière-sur-Tarn ; avant la station-service Peugeot, prendre à gauche : c’est au bout du chemin.',
    },
    {
      from: 'Depuis le sud (A75, Béziers), sans le viaduc',
      steps:
        'Sortie 47 La Cavalerie – Millau, puis Millau, direction Aguessac – Gorges du Tarn. À Aguessac, à droite par la D907. Traverser Rivière-sur-Tarn ; avant la station-service Peugeot, prendre à gauche.',
    },
  ],
};
