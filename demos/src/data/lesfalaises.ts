// Content taken from www.lesfalaises.fr (crawled 2026-11-02). Photos are the owners' own.
import type { Bnb } from './types';
import { dmsToDecimal } from '../lib/seo';

import droneVillage from '../assets/lesfalaises/98-2-gorges-drone-041.jpg';
import droneGorges from '../assets/lesfalaises/96-2-gorges-drone-042.jpg';
import droneHouse from '../assets/lesfalaises/100-2-gorges-drone-068.jpg';
import spaNight from '../assets/lesfalaises/90-2-1a1c4955-copier.jpg';
import spaDay from '../assets/lesfalaises/24-2-1a1c1330-copier.jpg';
import spaRoom from '../assets/lesfalaises/25-2-1a1c1347-copier.jpg';
import houseDusk from '../assets/lesfalaises/88-2-1a1c4931-copier.jpg';
import gardenDusk from '../assets/lesfalaises/89-2-1a1c4943-copier.jpg';
import houseNight from '../assets/lesfalaises/48-2-1a1c4960-copier.jpg';
import breakfastTerrace from '../assets/lesfalaises/115-2-eh4a9858-copier.jpg';
import breakfastTable from '../assets/lesfalaises/114-2-eh4a9834-copier.jpg';
import breakfastUmbrella from '../assets/lesfalaises/19-2-1a1c1169-copier.jpg';
import breakfastParasol from '../assets/lesfalaises/125-2-20190712-083521.jpg';
import breakfastVeranda from '../assets/lesfalaises/102-2-eh4a9815-copier.jpg';
import breakfastDetail from '../assets/lesfalaises/69-2-1a1c1180-copier.jpg';
import lounge from '../assets/lesfalaises/22-2-1a1c1304-copier.jpg';
import loungeVault from '../assets/lesfalaises/23-2-1a1c1308-copier.jpg';
import veranda from '../assets/lesfalaises/21-2-eh4a9787-copier.jpg';
import garden from '../assets/lesfalaises/116-2-eh4a8598-copier.jpg';
import gardenTables from '../assets/lesfalaises/122-2-eh4a9881-copier.jpg';
import hammock from '../assets/lesfalaises/123-2-eh4a8571-copier.jpg';
import cherryTree from '../assets/lesfalaises/124-2-eh4a8651-copier.jpg';
import gardenLounge from '../assets/lesfalaises/101-2-eh4a8624-copier.jpg';
import pond from '../assets/lesfalaises/105-2-eh4a8559-copier.jpg';
import patio from '../assets/lesfalaises/108-2-eh4a9750-copier.jpg';
import streetSide from '../assets/lesfalaises/109-2-eh4a9759-copier.jpg';
import courtyard from '../assets/lesfalaises/42-2-1a1c1280-copier.jpg';
import village from '../assets/lesfalaises/56-2-liaucous4.jpg';
import villageBlossom from '../assets/lesfalaises/57-2-liaucous5.jpg';
import cliffs from '../assets/lesfalaises/54-2-1a1c4892-copier.jpg';
import church from '../assets/lesfalaises/66-2-village4.jpg';
import calade from '../assets/lesfalaises/61-2-1a1c1274-copier.jpg';
import arch from '../assets/lesfalaises/64-2-village-2.jpg';
import roses from '../assets/lesfalaises/49-2-ot.jpg';
import hosts from '../assets/lesfalaises/113-2-eh4a8656-copier.jpg';
import panoramique1 from '../assets/lesfalaises/117-2-eh4a9734-redim1600.jpg';
import panoramique2 from '../assets/lesfalaises/118-2-eh4a9748-redim1600.jpg';
import panoramiqueBath from '../assets/lesfalaises/15-2-1a1c1391-copier.jpg';
import romance1 from '../assets/lesfalaises/11-2-1a1c1356-copier.jpg';
import romance2 from '../assets/lesfalaises/12-2-1a1c1362-copier.jpg';
import romanceBath from '../assets/lesfalaises/10-2-1a1c1351-copier.jpg';
import ogive1 from '../assets/lesfalaises/17-2-1a1c1418-copier.jpg';
import ogive2 from '../assets/lesfalaises/18-2-1a1c1457-copier.jpg';
import ogiveBath from '../assets/lesfalaises/16-2-1a1c1413-copier.jpg';
import roomDetail from '../assets/lesfalaises/82-2-1a1c1420-copier.jpg';
import window from '../assets/lesfalaises/79-2-1a1c1401-copier.jpg';

export const lesFalaises: Bnb = {
  slug: 'les-falaises',
  name: 'Les Falaises',
  tagline: "Chambres d'hôtes de charme et spa panoramique au cœur des gorges du Tarn",
  intro:
    'Une halte hors du temps dans un décor douillet et raffiné, en harmonie avec un paysage grandiose. Trois chambres avec entrée indépendante dans une maison restaurée du XVIIe siècle, à Liaucous, village médiéval classé au pied des falaises.',
  heroPhotos: [
    { src: droneVillage, alt: 'Vue aérienne du village de Liaucous au pied des falaises, dans les gorges du Tarn' },
    { src: spaNight, alt: 'Le spa intérieur illuminé le soir' },
    { src: houseDusk, alt: 'La maison Les Falaises éclairée à la tombée de la nuit' },
  ],
  highlights: [
    {
      title: 'Le spa panoramique',
      text: "Un spa intérieur dans une pièce dédiée, avec vue sur les gorges et la vallée. L'accès est inclus dans le prix de la chambre.",
      photos: [
        { src: spaNight, alt: 'Le spa illuminé en soirée' },
        { src: spaDay, alt: 'Le spa en journée, baie vitrée ouverte sur la vallée' },
        { src: spaRoom, alt: 'La pièce du spa et sa douche' },
      ],
    },
    {
      title: 'Le petit déjeuner face aux falaises',
      text: 'Servi sur la terrasse panoramique, avec une vue exceptionnelle sur les falaises et les gorges, ou dans la véranda quand le temps le demande.',
      photos: [
        { src: breakfastTerrace, alt: 'Petit déjeuner dressé sur la terrasse, vue sur les gorges' },
        { src: breakfastTable, alt: 'Table du petit déjeuner sous le parasol' },
        { src: breakfastUmbrella, alt: 'Terrasse au parasol rouge dominant la vallée' },
        { src: breakfastVeranda, alt: 'Petit déjeuner dans la véranda' },
        { src: breakfastDetail, alt: 'Cerises, confitures et jus du petit déjeuner' },
      ],
    },
    {
      title: 'La pièce commune',
      text: 'Salon sous voûte en pierre avec télévision, wifi, bibliothèque, jeux et documentation randonnée. Kitchenette pour une cuisine légère : micro-ondes, réfrigérateur, vaisselle, café expresso et thé à disposition.',
      photos: [
        { src: lounge, alt: 'Le salon voûté en pierre de la pièce commune' },
        { src: loungeVault, alt: 'Coin salon et bibliothèque' },
        { src: veranda, alt: 'La véranda lumineuse' },
      ],
    },
    {
      title: 'Le jardin de 2 400 m²',
      text: 'Un jardin en terrasses avec vue panoramique sur les gorges, un bassin, un patio, un boulodrome et des jeux pour les enfants.',
      photos: [
        { src: garden, alt: 'Le jardin en terrasses face aux gorges' },
        { src: gardenTables, alt: 'Tables de jardin colorées et vue sur la vallée' },
        { src: hammock, alt: 'Hamac sous les arbres du jardin' },
        { src: gardenLounge, alt: 'Salon de jardin devant la maison' },
        { src: pond, alt: 'Le bassin fleuri côté jardin' },
        { src: cherryTree, alt: 'Chaise longue sous le cerisier' },
      ],
    },
    {
      title: 'Liaucous, village médiéval classé',
      text: "Au cœur d'un site classé au patrimoine mondial de l'Unesco, à l'intersection des gorges du Tarn et de la Jonte. Calades pavées, église romane, nombreux sentiers de randonnée au pied de la via ferrata de Liaucous.",
      photos: [
        { src: village, alt: 'Liaucous et ses falaises calcaires' },
        { src: church, alt: "L'église romane de Liaucous" },
        { src: calade, alt: 'Une calade, petite ruelle pavée du village' },
        { src: arch, alt: 'Passage voûté dans le village' },
        { src: villageBlossom, alt: 'La vallée au printemps, arbres en fleurs' },
        { src: cliffs, alt: 'Les falaises au-dessus du village' },
      ],
    },
  ],
  gallery: [
    { src: houseDusk, alt: 'La maison à la tombée de la nuit' },
    { src: gardenDusk, alt: 'Le jardin au crépuscule' },
    { src: houseNight, alt: 'La maison et la terrasse éclairées le soir' },
    { src: droneGorges, alt: 'Vue aérienne de la vallée du Tarn' },
    { src: droneHouse, alt: 'Vue aérienne des toits du village' },
    { src: patio, alt: 'Le patio et ses volets bleus' },
    { src: streetSide, alt: 'La maison côté rue' },
    { src: courtyard, alt: 'La cour intérieure' },
    { src: roses, alt: 'Façade fleurie de roses' },
    { src: breakfastParasol, alt: 'Grande table sous le parasol rouge' },
    { src: roomDetail, alt: 'Détail de chambre sous la voûte' },
    { src: window, alt: 'Fenêtre de chambre ouverte sur le village' },
    { src: hosts, alt: 'Clin d’œil de vos hôtes' },
  ],
  practical: [
    'Arrivées en principe entre 12 h et 14 h ou entre 18 h et 20 h. Merci de nous prévenir la veille ou le matin.',
    'Départs le matin avant 11 h.',
    'Lit bébé sur demande.',
  ],
  url: 'https://www.lesfalaises.fr/',
  hosts: 'Brigitte et Patrick Marchetti',
  phone: '06 16 70 36 20',
  email: 'marchetti.patrick@wanadoo.fr',
  address: { street: "Calade de l'École, Liaucous", postalCode: '12720', locality: 'Mostuéjouls' },
  // GPS published on the site: E 3°11'42" N 44°12'9"
  geo: { latitude: dmsToDecimal(44, 12, 9, 'N'), longitude: dmsToDecimal(3, 11, 42, 'E') },
  google: { rating: 5, reviews: 46 },
  labels: ['Gîtes de France', 'Charmance'],
  seo: {
    title: "Les Falaises, chambres d'hôtes de charme et spa – Gorges du Tarn",
    description:
      "Trois chambres d'hôtes de charme avec spa panoramique à Liaucous (Mostuéjouls), village médiéval des gorges du Tarn, près de Millau. Petit déjeuner en terrasse face aux falaises.",
  },
  amenities: ['Spa intérieur panoramique', 'Petit déjeuner inclus', 'Wifi', 'Kitchenette', 'Jardin', 'Jeux pour enfants'],
  checkIn: '12:00',
  checkOut: '11:00',
  rooms: [
    {
      name: 'La Panoramique',
      summary: 'Lit 160, 18 m². Lit bébé sur demande.',
      photos: [
        { src: panoramique1, alt: 'La chambre Panoramique' },
        { src: panoramique2, alt: 'La Panoramique, coin bureau et poutres' },
        { src: panoramiqueBath, alt: 'Salle de bain de la Panoramique' },
      ],
    },
    {
      name: 'La Romance',
      summary: 'Lit 160, 18 m². Possibilité d’ajouter 1 ou 2 lits, lit bébé sur demande.',
      photos: [
        { src: romance1, alt: 'La chambre Romance, murs en pierre et rideaux rouges' },
        { src: romance2, alt: 'La Romance, coin fenêtre' },
        { src: romanceBath, alt: 'Salle de bain de la Romance' },
      ],
    },
    {
      name: "L'Ogive",
      summary: 'Lit 160 + lit 90, 18 m², balcon. Deux niveaux, deux entrées.',
      photos: [
        { src: ogive1, alt: "La chambre L'Ogive sous sa voûte en pierre" },
        { src: ogive2, alt: "L'Ogive, grand lit et porte-fenêtre" },
        { src: ogiveBath, alt: "Salle de bain de L'Ogive" },
      ],
    },
  ],
  prices: [
    {
      title: 'Nuitée pour 2 personnes, petit déjeuner et spa inclus',
      columns: ['Basse saison', 'Haute saison*'],
      rows: [
        { label: 'À partir de 2 nuits', values: ['115 à 125 €', '125 à 135 €'] },
        { label: 'Nuit seule', values: ['125 à 135 €', '140 à 150 €'] },
      ],
      notes: [
        '* Haute saison : ponts, fêtes et événements, vacances d’été.',
        'Personne supplémentaire : 30 € par nuit. Enfant de moins de 8 ans : 20 €. Moins de 2 ans : gratuit.',
        'Taxe de séjour : 0,66 € par nuit et par personne, enfants de moins de 13 ans exonérés.',
        'Bons cadeaux disponibles, utilisables en basse saison.',
      ],
    },
  ],
  bookingTerms: [
    'Un acompte confirme la réservation : une nuit pour un séjour de 1 à 3 nuits, deux nuits à partir de 4 nuits.',
    'Annulation plus de 20 jours avant l’arrivée : l’acompte est conservé.',
    'Annulation moins de 20 jours avant l’arrivée : l’acompte est conservé et la totalité du séjour est due.',
    'Départ anticipé : le séjour initial est facturé en totalité.',
  ],
  directions: [
    {
      from: 'Depuis Millau',
      steps:
        'RN9 jusqu’à Aguessac, puis D907 direction gorges du Tarn. 2,5 km après Boyne, tourner à gauche direction Liaucous et suivre les panneaux « Les Falaises ». Arrivée 50 m après l’église.',
    },
    {
      from: 'Depuis Le Rozier',
      steps: 'Direction Millau ; à 200 m, à droite, suivre les panneaux « Les Falaises ». Arrivée 50 m après l’église.',
    },
  ],
};
