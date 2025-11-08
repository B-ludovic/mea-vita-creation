// Importer le client Prisma
const { PrismaClient } = require('@prisma/client');

// Créer une instance unique de Prisma
// Cette instance sera réutilisée partout dans l'application
const prisma = new PrismaClient();

// Exporter pour l'utiliser dans d'autres fichiers
module.exports = prisma;