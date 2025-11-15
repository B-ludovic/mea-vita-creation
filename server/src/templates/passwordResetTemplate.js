const emailStyles = require('./emailStyles');

const getLogoUrl = () => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}/Logo_Francois_sansfond.PNG`;
};

const getSecureUrl = (path) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

const passwordResetTemplate = (userName, resetUrl) => {
  return `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.logoContainer}">
        <img src="${getLogoUrl()}" alt="Mea Vita Création" width="120" />
      </div>
      <h1 style="${emailStyles.mainTitle}">Réinitialisation de mot de passe</h1>
      <p style="${emailStyles.paragraph}">Bonjour ${userName},</p>
      <p style="${emailStyles.paragraph}">Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
      <div style="${emailStyles.buttonContainer}">
        <a href="${resetUrl}" style="${emailStyles.buttonPrimary}">
          Réinitialiser mon mot de passe
        </a>
      </div>
      <p style="${emailStyles.smallText}">
        Ce lien est valable pendant 1 heure.<br>
        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
      </p>
    </div>
  `;
};

module.exports = passwordResetTemplate;
