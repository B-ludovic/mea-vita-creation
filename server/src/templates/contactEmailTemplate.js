const emailStyles = require('./emailStyles');

const getLogoUrl = () => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}/Logo_Francois_sansfond.PNG`;
};

const getSecureUrl = (path) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

const contactEmailTemplate = (name, email, subject, message) => {
  return `
    <div style="${emailStyles.container}">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-flex; align-items: center; gap: 12px;">
          <img src="${getLogoUrl()}" alt="Logo" width="40" height="40" style="vertical-align: middle;" />
          <span style="font-size: 28px; font-weight: 700; color: #2C2C2C; font-family: 'Playfair Display', serif;">Mea Vita Création</span>
        </div>
      </div>
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${getSecureUrl('/icones/mail.png')}" alt="Message" width="60" height="60" />
      </div>
      <h1 style="${emailStyles.mainTitle}">Nouveau message de contact</h1>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <p style="${emailStyles.paragraph}; margin: 10px 0;"><strong>De :</strong> ${name}</p>
        <p style="${emailStyles.paragraph}; margin: 10px 0;"><strong>Email :</strong> ${email}</p>
        <p style="${emailStyles.paragraph}; margin: 10px 0;"><strong>Sujet :</strong> ${subject}</p>
      </div>
      
      <div style="background: #fff; padding: 20px; border-left: 4px solid #FFAB00; margin: 20px 0;">
        <h3 style="${emailStyles.secondaryTitle}; margin-top: 0;">Message :</h3>
        <p style="${emailStyles.paragraph}; white-space: pre-wrap;">${message}</p>
      </div>
      
      <p style="${emailStyles.smallText}">
        Pour répondre, clique simplement sur "Répondre" dans ta boîte mail.
      </p>
    </div>
  `;
};

module.exports = contactEmailTemplate;
