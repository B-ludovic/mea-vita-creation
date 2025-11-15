const emailStyles = require('./emailStyles');

const getLogoUrl = () => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}/Logo_Francois_sansfond.PNG`;
};

const getSecureUrl = (path) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

const verificationEmailTemplate = (userName, verificationUrl) => {
  return `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.logoContainer}">
        <img src="${getLogoUrl()}" alt="Mea Vita Création" width="120" />
      </div>
      <h1 style="${emailStyles.mainTitle}">Bienvenue sur Mea Vita Création</h1>
      <p style="${emailStyles.paragraph}">Bonjour ${userName},</p>
      <p style="${emailStyles.paragraph}">Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
      <div style="${emailStyles.buttonContainer}">
        <a href="${verificationUrl}" style="${emailStyles.buttonPrimary}">
          Vérifier mon email
        </a>
      </div>
      <p style="${emailStyles.smallText}">
        Ce lien est valable pendant 24 heures.<br>
        Si vous n'avez pas créé de compte, ignorez cet email.
      </p>
    </div>
  `;
};

module.exports = verificationEmailTemplate;
