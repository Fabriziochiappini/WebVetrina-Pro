// Vercel Serverless Function — replaces the old Express /api/contact endpoint.
// Validates the form payload and sends the notification email via SendGrid,
// preserving the original template and sender/recipient configuration.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import sgMail from '@sendgrid/mail';

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  businessType: string;
  message?: string;
}

function isString(v: unknown, min = 1): v is string {
  return typeof v === 'string' && v.trim().length >= min;
}

function validate(body: any): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Payload non valido' };
  const { firstName, lastName, email, phone, company, businessType, message } = body;
  if (!isString(firstName))    return { ok: false, error: 'Nome richiesto' };
  if (!isString(lastName))     return { ok: false, error: 'Cognome richiesto' };
  if (!isString(email) || !/.+@.+\..+/.test(email)) return { ok: false, error: 'Email non valida' };
  if (!isString(phone, 5))     return { ok: false, error: 'Telefono richiesto' };
  if (!isString(businessType)) return { ok: false, error: 'Tipo di attività richiesto' };
  return {
    ok: true,
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: isString(company) ? company.trim() : undefined,
      businessType: businessType.trim(),
      message: isString(message) ? message.trim() : '',
    },
  };
}

function buildEmail(d: ContactPayload) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
        Nuovo Contatto dal Sito Web
      </h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #334155;">Informazioni Cliente</h3>
        <p><strong>Nome:</strong> ${d.firstName} ${d.lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${d.email}">${d.email}</a></p>
        <p><strong>Telefono:</strong> <a href="tel:${d.phone}">${d.phone}</a></p>
        ${d.company ? `<p><strong>Azienda:</strong> ${d.company}</p>` : ''}
        <p><strong>Tipo di Attività:</strong> ${d.businessType}</p>
      </div>
      <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #334155;">Messaggio</h3>
        <p style="white-space: pre-wrap;">${d.message || '(nessun messaggio)'}</p>
      </div>
      <div style="margin-top: 30px; padding: 15px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
        <p style="margin: 0; font-size: 14px; color: #1e40af;">
          <strong>Azione Consigliata:</strong> Rispondi entro 24 ore per mantenere alta la conversione.
        </p>
      </div>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 12px; color: #64748b; text-align: center;">
        Email generata automaticamente dal sistema di contatti di WebProItalia.com
      </p>
    </div>
  `;
  const text = `Nuovo Contatto dal Sito Web

Nome: ${d.firstName} ${d.lastName}
Email: ${d.email}
Telefono: ${d.phone}
${d.company ? `Azienda: ${d.company}\n` : ''}Tipo di Attività: ${d.businessType}

Messaggio:
${d.message || '(nessun messaggio)'}
`;
  return { html, text };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error('SENDGRID_API_KEY missing in env');
    return res.status(500).json({ message: 'Configurazione email mancante sul server' });
  }

  const result = validate(req.body);
  if (!result.ok) {
    return res.status(400).json({ message: result.error });
  }
  const data = result.data;

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'seofibra@gmail.com';
  const fromName  = process.env.SENDGRID_FROM_NAME  || 'WebProItalia - Sistema Contatti';
  const toEmail   = process.env.SENDGRID_TO_EMAIL   || 'info@webproitalia.com';

  sgMail.setApiKey(apiKey);
  const { html, text } = buildEmail(data);

  try {
    await sgMail.send({
      to: toEmail,
      from: { email: fromEmail, name: fromName },
      replyTo: { email: data.email, name: `${data.firstName} ${data.lastName}` },
      subject: `Richiesta informazioni realizzazione sito web - ${data.firstName} ${data.lastName} (${data.businessType})`,
      html,
      text,
    });
    return res.status(200).json({ message: 'Richiesta inviata correttamente' });
  } catch (err: any) {
    console.error('SendGrid error:', err?.response?.body || err);
    return res.status(500).json({ message: "Errore nell'invio dell'email" });
  }
}
