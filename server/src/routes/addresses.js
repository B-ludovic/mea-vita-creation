// Importer Express Router
const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur
const { 
  getUserAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress,
  setDefaultAddress 
} = require('../controllers/addressController');

// ROUTE POUR RÉCUPÉRER LES ADRESSES D'UN UTILISATEUR
// GET /api/addresses/user/:userId
router.get('/user/:userId', getUserAddresses);

// ROUTE POUR CRÉER UNE ADRESSE
// POST /api/addresses
router.post('/', createAddress);

// ROUTE POUR METTRE À JOUR UNE ADRESSE
// PUT /api/addresses/:addressId
router.put('/:addressId', updateAddress);

// ROUTE POUR SUPPRIMER UNE ADRESSE
// DELETE /api/addresses/:addressId
router.delete('/:addressId', deleteAddress);

// ROUTE POUR DÉFINIR UNE ADRESSE PAR DÉFAUT
// PUT /api/addresses/:addressId/default
router.put('/:addressId/default', setDefaultAddress);

// Exporter le router
module.exports = router;