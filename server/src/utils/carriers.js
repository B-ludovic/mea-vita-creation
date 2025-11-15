// Utilitaire pour générer les URLs de tracking selon le transporteur

// Liste des transporteurs supportés avec leurs URLs de tracking
const carriers = {
  'Colissimo': {
    name: 'Colissimo',
    trackingUrl: (trackingNumber) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`,
    regex: /^([A-Z]{2}\d{9}[A-Z]{2}|\d{13,15})$/ // Format: AB123456789FR OU 13-15 chiffres
  },
  'Chronopost': {
    name: 'Chronopost',
    trackingUrl: (trackingNumber) => `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${trackingNumber}`,
    regex: /^\d{13}$/
  },
  'DHL': {
    name: 'DHL',
    trackingUrl: (trackingNumber) => `https://www.dhl.com/fr-fr/home/tracking/tracking-parcel.html?submit=1&tracking-id=${trackingNumber}`,
    regex: /^\d{10,11}$/
  },
  'UPS': {
    name: 'UPS',
    trackingUrl: (trackingNumber) => `https://www.ups.com/track?loc=fr_FR&tracknum=${trackingNumber}`,
    regex: /^1Z[A-Z0-9]{16}$/
  },
  'FedEx': {
    name: 'FedEx',
    trackingUrl: (trackingNumber) => `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    regex: /^\d{12,14}$/
  },
  'Mondial Relay': {
    name: 'Mondial Relay',
    trackingUrl: (trackingNumber) => `https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=${trackingNumber}`,
    regex: /^\d{8,13}$/
  },
  'GLS': {
    name: 'GLS',
    trackingUrl: (trackingNumber) => `https://gls-group.eu/FR/fr/suivi-colis?match=${trackingNumber}`,
    regex: /^\d{11}$/
  },
  'TNT': {
    name: 'TNT',
    trackingUrl: (trackingNumber) => `https://www.tnt.com/express/fr_fr/site/outils-expedition/suivi.html?searchType=con&cons=${trackingNumber}`,
    regex: /^\d{9}$/
  }
};

// Fonction pour générer l'URL de tracking
const generateTrackingUrl = (carrier, trackingNumber) => {
  if (!carrier || !trackingNumber) {
    return null;
  }

  // Vérifier les types pour éviter les injections
  if (typeof carrier !== 'string' || typeof trackingNumber !== 'string') {
    return null;
  }

  // Nettoyer le numéro de tracking (enlever espaces, tirets, caractères dangereux)
  const cleanTrackingNumber = trackingNumber
    .replace(/[\s-]/g, '')
    .replace(/[^A-Za-z0-9]/g, ''); // Garder uniquement alphanumériques

  // Limite de longueur pour éviter les abus
  if (cleanTrackingNumber.length > 50 || cleanTrackingNumber.length < 1) {
    return null;
  }

  // Rechercher le transporteur (insensible à la casse)
  const carrierKey = Object.keys(carriers).find(
    key => key.toLowerCase() === carrier.toLowerCase()
  );

  if (!carrierKey) {
    // Transporteur non trouvé, retourner null
    return null;
  }

  const carrierInfo = carriers[carrierKey];

  // Encoder l'URL pour sécuriser les paramètres
  const encodedTracking = encodeURIComponent(cleanTrackingNumber);
  
  // Générer l'URL avec le numéro encodé
  return carrierInfo.trackingUrl(encodedTracking);
};

// Fonction pour valider un numéro de tracking
const validateTrackingNumber = (carrier, trackingNumber) => {
  if (!carrier || !trackingNumber) {
    return false;
  }

  // Vérifier les types
  if (typeof carrier !== 'string' || typeof trackingNumber !== 'string') {
    return false;
  }

  // Nettoyer et limiter la longueur
  const cleanTrackingNumber = trackingNumber
    .replace(/[\s-]/g, '')
    .replace(/[^A-Za-z0-9]/g, '');

  if (cleanTrackingNumber.length > 50 || cleanTrackingNumber.length < 1) {
    return false;
  }

  const carrierKey = Object.keys(carriers).find(
    key => key.toLowerCase() === carrier.toLowerCase()
  );

  if (!carrierKey) {
    return true; // Si transporteur inconnu, on accepte quand même
  }

  const carrierInfo = carriers[carrierKey];

  // Vérifier le format avec regex
  return carrierInfo.regex.test(cleanTrackingNumber);
};

// Fonction pour obtenir la liste des transporteurs
const getCarriersList = () => {
  return Object.keys(carriers);
};

module.exports = {
  generateTrackingUrl,
  validateTrackingNumber,
  getCarriersList,
  carriers
};