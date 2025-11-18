-- Script pour remettre les slugs de catégories au singulier
-- Date: 2025-11-18
-- Sauvegarde effectuée: backup-20251118-030309.backup

BEGIN;

-- Mise à jour des slugs de catégories
UPDATE "Category" 
SET slug = 'sacs-u' 
WHERE slug = 'sacs-us';

UPDATE "Category" 
SET slug = 'pochettes-unisexe' 
WHERE slug = 'pochettes-unisexes';

UPDATE "Category" 
SET slug = 'sacs-cylindre' 
WHERE slug = 'sacs-cylindres';

-- Vérification des changements
SELECT id, name, slug FROM "Category" ORDER BY name;

COMMIT;
