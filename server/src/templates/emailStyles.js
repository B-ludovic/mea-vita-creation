// Styles CSS pour les emails - Mea Vita Création

const emailStyles = {
  // Container principal
  container: `
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `,

  // Logo container
  logoContainer: `
    text-align: center;
    margin-bottom: 30px;
  `,

  // Titre principal
  mainTitle: `
    color: #FFAB00;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
  `,

  // Titre secondaire
  secondaryTitle: `
    color: #333;
    font-size: 20px;
    margin-top: 30px;
    margin-bottom: 15px;
  `,

  // Paragraphe
  paragraph: `
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    margin: 15px 0;
  `,

  // Bouton primaire (gradient jaune solaire)
  buttonPrimary: `
    background: linear-gradient(135deg, #FFDA44, #FFAB00);
    color: white;
    padding: 15px 35px;
    text-decoration: none;
    border-radius: 50px;
    display: inline-block;
    font-weight: bold;
    margin: 10px 5px;
  `,

  // Bouton secondaire (outline)
  buttonSecondary: `
    background: #FFFFFF;
    color: #FFAB00;
    border: 2px solid #FFAB00;
    padding: 15px 35px;
    text-decoration: none;
    border-radius: 50px;
    display: inline-block;
    font-weight: bold;
    margin: 10px 5px;
  `,

  // Container des boutons
  buttonContainer: `
    text-align: center;
    margin: 30px 0;
  `,

  // Tableau
  table: `
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  `,

  tableHeader: `
    background: #f5f5f5;
    padding: 10px;
    text-align: left;
  `,

  tableCell: `
    padding: 10px;
    border-bottom: 1px solid #eee;
  `,

  tableCellCenter: `
    padding: 10px;
    border-bottom: 1px solid #eee;
    text-align: center;
  `,

  tableCellRight: `
    padding: 10px;
    border-bottom: 1px solid #eee;
    text-align: right;
  `,

  tableCellBold: `
    padding: 10px;
    border-bottom: 1px solid #eee;
    text-align: right;
    font-weight: bold;
  `,

  tableFooter: `
    padding: 15px 10px;
    text-align: right;
    font-size: 18px;
    font-weight: bold;
  `,

  tableTotal: `
    padding: 15px 10px;
    text-align: right;
    font-size: 18px;
    font-weight: bold;
    color: #FFAB00;
  `,

  // Box de succès
  successBox: `
    background: #e8f5e9;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
  `,

  successBoxTitle: `
    margin: 0;
    color: #2e7d32;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  `,

  // Pied de page
  footer: `
    color: #666;
    font-size: 14px;
    margin-top: 30px;
    line-height: 1.6;
  `,

  // Texte petit
  smallText: `
    color: #666;
    font-size: 14px;
    line-height: 1.6;
  `
};

module.exports = emailStyles;
