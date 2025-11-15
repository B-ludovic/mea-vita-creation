const emailStyles = require('./emailStyles');

const getLogoUrl = () => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}/Logo_Francois_sansfond.PNG`;
};

const getSecureUrl = (path) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

const welcomeEmailTemplate = (userName) => {
  return `
    <div style="${emailStyles.container}">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-flex; align-items: center; gap: 12px;">
          <img src="${getLogoUrl()}" alt="Logo" width="40" height="40" style="vertical-align: middle;" />
          <span style="font-size: 28px; font-weight: 700; color: #2C2C2C; font-family: 'Playfair Display', serif;">Mea Vita Création</span>
        </div>
      </div>
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${getSecureUrl('/icones/congratulation.png')}" alt="Bienvenue" width="80" height="80" />
      </div>
      <h1 style="${emailStyles.mainTitle}">Bienvenue ${userName} !</h1>
      <p style="${emailStyles.paragraph}">
        Merci de nous avoir rejoint ! Nous sommes ravis de vous compter parmi nos clients.
      </p>
      <p style="${emailStyles.paragraph}">
        Découvrez nos créations artisanales uniques et laissez-vous séduire par l'art de la maroquinerie.
      </p>
      <div style="${emailStyles.buttonContainer}">
        <a href="${getSecureUrl('/categories')}" style="${emailStyles.buttonPrimary}">
          Découvrir nos créations
        </a>
      </div>
      <p style="${emailStyles.footer}">
        À très bientôt,<br>
        L'équipe Mea Vita Création
      </p>
    </div>
  `;
};

module.exports = welcomeEmailTemplate;
