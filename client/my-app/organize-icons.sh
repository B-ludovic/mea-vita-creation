#!/bin/bash
# Script pour organiser les icônes dans /public/icones/
# Utilisation: bash organize-icons.sh

echo "🚀 Début de l'organisation des icônes..."

# Étape 1: Créer le dossier icones
echo "📁 Création du dossier /public/icones/..."
mkdir -p public/icones

# Étape 2: Liste des icônes à déplacer (TOUT sauf Logo et images/)
ICONS=(
    "annuler.png"
    "artisanat.png"
    "authenticite.png"
    "camera.png"
    "category.png"
    "chat.png"
    "chiffre-affaire.png"
    "confection.png"
    "congratulation.png"
    "default.png"
    "delivery-box.png"
    "delivery.png"
    "desactiver.png"
    "e-commerce.png"
    "error.png"
    "evolution.png"
    "excellence.png"
    "favori-empty.png"
    "favori.png"
    "finition_luxe.png"
    "heritage.png"
    "home.png"
    "instagram.png"
    "invoice.png"
    "iphone.png"
    "location.png"
    "mail.png"
    "modify.png"
    "ok.png"
    "paiment-refuse.png"
    "payment.png"
    "philosophie.png"
    "promouvoir.png"
    "qualite.png"
    "recycle.png"
    "retrograder.png"
    "review.png"
    "sand-timer.png"
    "satistic.png"
    "sent-mail.png"
    "shopping.png"
    "tissus_wax.png"
    "trash.png"
    "tree.png"
    "trophy.png"
    "user-rating.png"
    "users.png"
    "validation.png"
)

# Étape 3: Déplacer les icônes
echo "📦 Déplacement des icônes..."
for icon in "${ICONS[@]}"; do
    if [ -f "public/$icon" ]; then
        mv "public/$icon" "public/icones/"
        echo "  ✓ Déplacé: $icon"
    fi
done

# Étape 4: Créer une sauvegarde avant modification des fichiers
echo "💾 Création d'une sauvegarde..."
backup_dir="backup_before_icon_reorganization_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
cp -r app "$backup_dir/"
cp -r components "$backup_dir/"
cp -r styles "$backup_dir/"
[ -d "../server/src/services" ] && cp -r ../server/src/services "$backup_dir/"
[ -d "../server/src/templates" ] && cp -r ../server/src/templates "$backup_dir/"
echo "  ✓ Sauvegarde créée dans: $backup_dir"

# Étape 5: Remplacer les chemins dans les fichiers frontend
echo "🔧 Mise à jour des chemins dans les fichiers..."

# Frontend: app, components, styles
for dir in app components styles; do
    find "$dir" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) -print0 | while IFS= read -r -d '' file; do
        # Remplacer chaque icône (sauf Logo)
        for icon in "${ICONS[@]}"; do
            sed -i '' "s|\"/${icon}\"|\"\/icones\/${icon}\"|g" "$file"
            sed -i '' "s|'/${icon}'|'\/icones\/${icon}'|g" "$file"
            sed -i '' "s|src=\"/${icon}\"|src=\"\/icones\/${icon}\"|g" "$file"
        done
    done
done

# Backend: services et templates
if [ -d "../server/src/services" ]; then
    echo "🔧 Mise à jour des chemins dans les services backend..."
    find ../server/src/services -type f -name "*.js" -print0 | while IFS= read -r -d '' file; do
        for icon in "${ICONS[@]}"; do
            sed -i '' "s|'/${icon}'|'\/icones\/${icon}'|g" "$file"
            sed -i '' "s|\"/${icon}\"|\"\/icones\/${icon}\"|g" "$file"
        done
    done
fi

if [ -d "../server/src/templates" ]; then
    echo "🔧 Mise à jour des chemins dans les templates backend..."
    find ../server/src/templates -type f -name "*.js" -print0 | while IFS= read -r -d '' file; do
        for icon in "${ICONS[@]}"; do
            sed -i '' "s|'/${icon}'|'\/icones\/${icon}'|g" "$file"
            sed -i '' "s|\"/${icon}\"|\"\/icones\/${icon}\"|g" "$file"
        done
    done
fi

echo ""
echo "✅ Organisation terminée !"
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Testez votre site pour vérifier que toutes les icônes s'affichent"
echo "  2. Si tout fonctionne: supprimez le dossier de sauvegarde"
echo "  3. Si problème: restaurez depuis $backup_dir"
echo ""
echo "🔄 Pour restaurer en cas de problème:"
echo "  cp -r $backup_dir/app/* app/"
echo "  cp -r $backup_dir/components/* components/"
echo "  cp -r $backup_dir/styles/* styles/"
echo "  [ -d \"$backup_dir/services\" ] && cp -r $backup_dir/services/* ../server/src/services/"
echo "  [ -d \"$backup_dir/templates\" ] && cp -r $backup_dir/templates/* ../server/src/templates/"
