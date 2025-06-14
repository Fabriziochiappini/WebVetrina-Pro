const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header semplice */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">Informativa sul trattamento dei dati personali</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Titolare del Trattamento</h2>
            <p className="text-gray-700 leading-relaxed">
              Il Titolare del trattamento dei dati è <strong>WebProItalia</strong>, con sede in Via Casilina Sud 116, Frosinone.
              <br />Email: info@webproitalia.com
              <br />Telefono: +39 347 9942321
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Dati Raccolti</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Attraverso il nostro sito web raccogliamo i seguenti dati personali:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Dati di contatto:</strong> nome, cognome, email, telefono, nome azienda</li>
              <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, pagine visitate</li>
              <li><strong>Cookie tecnici:</strong> necessari per il funzionamento del sito</li>
              <li><strong>Cookie di marketing:</strong> per migliorare l'esperienza utente (solo con consenso)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Finalità del Trattamento</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              I tuoi dati personali vengono trattati per le seguenti finalità:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Rispondere alle richieste di contatto e preventivi</li>
              <li>Fornire i servizi di sviluppo web richiesti</li>
              <li>Comunicazioni commerciali (solo con consenso esplicito)</li>
              <li>Miglioramento dei servizi offerti</li>
              <li>Adempimenti di obblighi legali</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Base Giuridica</h2>
            <p className="text-gray-700 leading-relaxed">
              Il trattamento dei dati è basato su:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Consenso:</strong> per comunicazioni marketing e cookie non essenziali</li>
              <li><strong>Interesse legittimo:</strong> per rispondere alle richieste di contatto</li>
              <li><strong>Esecuzione contrattuale:</strong> per fornire i servizi richiesti</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Conservazione dei Dati</h2>
            <p className="text-gray-700 leading-relaxed">
              I dati personali vengono conservati per il tempo strettamente necessario alle finalità per cui sono stati raccolti:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Richieste di contatto:</strong> 2 anni dalla raccolta</li>
              <li><strong>Clienti:</strong> 10 anni per obblighi fiscali</li>
              <li><strong>Cookie:</strong> secondo le specifiche di ciascun cookie</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Cookie Utilizzati</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-3">Cookie Tecnici (Sempre Attivi)</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Cookie di sessione per il funzionamento del sito</li>
                <li>Cookie per la sicurezza e prevenzione frodi</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Cookie di Marketing (Opzionali)</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Meta Pixel:</strong> per ottimizzare le campagne pubblicitarie</li>
                <li><strong>Google Analytics:</strong> per analizzare il traffico del sito</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">7. I Tuoi Diritti</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In conformità al GDPR, hai diritto a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Accesso:</strong> conoscere quali dati abbiamo su di te</li>
              <li><strong>Rettifica:</strong> correggere dati inesatti o incompleti</li>
              <li><strong>Cancellazione:</strong> richiedere la rimozione dei tuoi dati</li>
              <li><strong>Portabilità:</strong> ricevere i tuoi dati in formato strutturato</li>
              <li><strong>Opposizione:</strong> opporti al trattamento per finalità specifiche</li>
              <li><strong>Limitazione:</strong> limitare il trattamento in determinate circostanze</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Per esercitare i tuoi diritti, contattaci all'indirizzo: <strong>info@webproitalia.com</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Sicurezza dei Dati</h2>
            <p className="text-gray-700 leading-relaxed">
              Adottiamo misure tecniche e organizzative adeguate per proteggere i tuoi dati personali da accessi non autorizzati, 
              perdite, modifiche o divulgazioni accidentali. Tutti i dati sono trasmessi attraverso connessioni sicure SSL/TLS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Modifiche alla Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              Ci riserviamo il diritto di aggiornare questa Privacy Policy. Le modifiche saranno pubblicate su questa pagina 
              con indicazione della data di ultima modifica.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Contatti</h2>
            <div className="bg-primary/5 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                Per qualsiasi domanda riguardante questa Privacy Policy o il trattamento dei tuoi dati personali, puoi contattarci:
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li><strong>Email:</strong> info@webproitalia.com</li>
                <li><strong>Telefono:</strong> +39 347 9942321</li>
                <li><strong>Indirizzo:</strong> Via Casilina Sud 116, Frosinone</li>
              </ul>
            </div>
          </section>

          <div className="bg-gray-100 p-6 rounded-lg mt-12">
            <p className="text-sm text-gray-600">
              <strong>Ultima modifica:</strong> 14 Giugno 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;