import { Link } from 'react-router-dom';

const CONTACT = 'mcipollone75@gmail.com';
const UPDATED = '26 ottobre 2026';

export default function Privacy() {
  return (
    <div className="content legal">
      <Link to="/">← Torna all'app</Link>
      <h1>Informativa sulla privacy</h1>
      <p className="muted">Ultimo aggiornamento: {UPDATED}</p>

      <p>
        Questa informativa spiega quali dati raccoglie Gestione Spese, perché e come puoi controllarli, ai sensi
        del Regolamento UE 2016/679 (GDPR).
      </p>

      <h2>Titolare del trattamento</h2>
      <p>
        Manuel Cipollone, Vasto (CH). Per qualsiasi richiesta: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>Quali dati raccogliamo</h2>
      <ul>
        <li>
          <strong>Dati dell'account:</strong> nome ed email. La password non viene mai salvata in chiaro, ma solo in
          forma cifrata (hash).
        </li>
        <li>
          <strong>Dati che inserisci:</strong> movimenti (importo, categoria, data, nota), obiettivi di risparmio e
          budget.
        </li>
        <li>
          <strong>Dati tecnici:</strong> l'indirizzo IP viene usato per limitare i tentativi di accesso e può
          comparire nei registri tecnici del server.
        </li>
      </ul>
      <p>Non raccogliamo dati di pagamento, coordinate bancarie né documenti d'identità.</p>

      <h2>Perché li usiamo</h2>
      <p>
        Solo per farti usare l'app: mostrarti saldo, grafici, obiettivi e budget, e tenerli sincronizzati tra i tuoi
        dispositivi. La base giuridica è l'esecuzione del servizio che richiedi registrandoti (art. 6.1.b GDPR).
        I dati non vengono venduti, ceduti a terzi né usati per pubblicità o profilazione.
      </p>

      <h2>Cookie</h2>
      <p>
        Usiamo un solo cookie tecnico, <code>token</code>, che ti mantiene collegato per 30 giorni. È necessario al
        funzionamento dell'app e per questo non richiede consenso. Non usiamo cookie di analisi o di profilazione.
      </p>

      <h2>Dove sono conservati</h2>
      <p>I dati sono gestiti tramite due fornitori che agiscono come responsabili del trattamento:</p>
      <ul>
        <li>
          <strong>Render Services, Inc.</strong> — ospita l'app e il server.
        </li>
        <li>
          <strong>MongoDB, Inc. (MongoDB Atlas)</strong> — ospita il database.
        </li>
      </ul>
      <p>
        Sono aziende con sede negli Stati Uniti. Eventuali trasferimenti di dati fuori dall'Unione Europea avvengono
        con le garanzie previste dal GDPR, come le clausole contrattuali standard della Commissione Europea.
      </p>

      <h2>Per quanto tempo</h2>
      <p>
        Finché il tuo account è attivo. Se elimini l'account dalla pagina <em>Account</em>, l'account e tutti i
        movimenti, gli obiettivi e i budget vengono cancellati subito e in modo definitivo.
      </p>

      <h2>I tuoi diritti</h2>
      <p>
        Puoi chiedere di accedere ai tuoi dati, correggerli, cancellarli, limitarne il trattamento, opporti o
        riceverne una copia (artt. 15–22 GDPR) scrivendo a <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. La
        cancellazione puoi farla anche da solo, in qualsiasi momento, dalla pagina <em>Account</em>.
      </p>
      <p>
        Se ritieni che i tuoi dati siano trattati in modo non corretto, puoi presentare reclamo al Garante per la
        protezione dei dati personali (<a href="https://www.garanteprivacy.it">www.garanteprivacy.it</a>).
      </p>

      <h2>Sicurezza</h2>
      <p>
        Il collegamento all'app è cifrato (HTTPS), le password sono salvate solo in forma cifrata e ogni utente può
        vedere esclusivamente i propri dati.
      </p>

      <h2>Modifiche</h2>
      <p>Se questa informativa cambia, la data in alto verrà aggiornata.</p>
    </div>
  );
}
