import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log('SendGrid configurato con API key');

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  businessType: string;
  message: string;
}

export async function sendContactNotification(formData: ContactFormData): Promise<boolean> {
  try {
    console.log('Tentativo invio email a info@webproitalia.com per:', formData.firstName, formData.lastName);
    
    const msg = {
      to: 'info@webproitalia.com',
      from: {
        email: 'seofibra@gmail.com',
        name: 'WebProItalia - Sistema Contatti'
      },
      replyTo: {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`
      },
      subject: `Richiesta informazioni realizzazione sito web - ${formData.firstName} ${formData.lastName} (${formData.businessType})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Nuovo Contatto dal Sito Web
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">Informazioni Cliente</h3>
            <p><strong>Nome:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            <p><strong>Telefono:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></p>
            ${formData.company ? `<p><strong>Azienda:</strong> ${formData.company}</p>` : ''}
            <p><strong>Tipo di Attività:</strong> ${formData.businessType}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #334155;">Messaggio</h3>
            <p style="white-space: pre-wrap;">${formData.message}</p>
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
      `,
      text: `
        Nuovo Contatto dal Sito Web
        
        Nome: ${formData.firstName} ${formData.lastName}
        Email: ${formData.email}
        Telefono: ${formData.phone}
        ${formData.company ? `Azienda: ${formData.company}` : ''}
        Tipo di Attività: ${formData.businessType}
        
        Messaggio:
        ${formData.message}
      `
    };

    const response = await sgMail.send(msg);
    console.log('Email notification sent successfully to info@webproitalia.com');
    console.log('SendGrid response:', response[0].statusCode, response[0].headers);
    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    if (error.response) {
      console.error('SendGrid response:', error.response.body);
    }
    return false;
  }
}

export async function sendAutoReply(userEmail: string, firstName: string, lastName: string): Promise<boolean> {
  try {
    const msg = {
      to: userEmail,
      from: {
        email: 'seofibra@gmail.com',
        name: 'WebProItalia'
      },
      replyTo: 'info@webproitalia.com',
      subject: 'Grazie per averci contattato - WebProItalia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">WebProItalia</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sviluppo Siti Web Professionali</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #2563eb; margin-top: 0;">Ciao ${firstName},</h2>
            
            <p>Grazie per averci contattato! Abbiamo ricevuto la tua richiesta e il nostro team la esaminerà con attenzione.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin-top: 0; color: #334155;">Cosa succede ora?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Ti risponderemo entro <strong>24 ore</strong></li>
                <li>Analizzeremo le tue esigenze specifiche</li>
                <li>Ti invieremo un preventivo personalizzato</li>
                <li>Pianificheremo una call per discutere i dettagli</li>
              </ul>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">Nel frattempo...</h3>
              <p style="margin-bottom: 15px;">Dai un'occhiata ai nostri progetti recenti:</p>
              <a href="https://webproitalia.com/portfolio" 
                 style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; font-weight: bold;">
                Visualizza Portfolio
              </a>
            </div>
            
            <p style="margin-bottom: 30px;">Se hai domande urgenti, non esitare a chiamarci al <strong>+39 347 9942321</strong>.</p>
            
            <p>A presto!<br>
            <strong>Il Team WebProItalia</strong></p>
          </div>
          
          <div style="background: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              <strong>WebProItalia</strong><br>
              Via Casilina Sud 116, Frosinone<br>
              +39 347 9942321 | info@webproitalia.com
            </p>
          </div>
        </div>
      `,
      text: `
        Ciao ${firstName},
        
        Grazie per averci contattato! Abbiamo ricevuto la tua richiesta e il nostro team la esaminerà con attenzione.
        
        Ti risponderemo entro 24 ore con un preventivo personalizzato.
        
        Se hai domande urgenti, chiamaci al +39 347 9942321.
        
        A presto!
        Il Team WebProItalia
        
        WebProItalia
        Via Casilina Sud 116, Frosinone
        +39 347 9942321 | info@webproitalia.com
      `
    };

    await sgMail.send(msg);
    console.log(`Auto-reply sent successfully to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('SendGrid auto-reply error:', error);
    return false;
  }
}