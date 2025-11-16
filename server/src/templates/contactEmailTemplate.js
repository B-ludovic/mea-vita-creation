const emailStyles = require('./emailStyles');

const contactEmailTemplate = (name, email, subject, message) => {
  return `
    <div style="${emailStyles.container}">
      <h1 style="color: #FF6B35;">📧 Nouveau message de contact</h1>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <p style="margin: 10px 0;"><strong>De :</strong> ${name}</p>
        <p style="margin: 10px 0;"><strong>Email :</strong> ${email}</p>
        <p style="margin: 10px 0;"><strong>Sujet :</strong> ${subject}</p>
      </div>
      
      <div style="background: #fff; padding: 20px; border-left: 4px solid #FF6B35; margin: 20px 0;">
        <h3 style="margin-top: 0;">Message :</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
      </div>
      
      <p style="${emailStyles.smallText}">
        Pour répondre, clique simplement sur "Répondre" dans ta boîte mail.
      </p>
    </div>
  `;
};

module.exports = contactEmailTemplate;
