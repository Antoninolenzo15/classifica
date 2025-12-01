const admin = require('firebase-admin');
const { VercelRequest, VercelResponse } = require('@vercel/node');

// Legge il service account dalle variabili d'ambiente
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

// Inizializza Firebase Admin solo una volta
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const collectionName = 'items'; // Nome della collection su Firestore

module.exports = async (req, res) => {
  try {
    // GET → legge tutti i documenti
    if (req.method === 'GET') {
      const snapshot = await db.collection(collectionName).get();
      const data = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      return res.status(200).json(data);
    }

    // POST → aggiunge un nuovo documento
    else if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);

      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ message: 'Body non valido, deve essere un oggetto JSON' });
      }

      // Se vuoi salvare anche la data di creazione
      if (!body.createdAt) body.createdAt = new Date().toISOString();

      const docRef = await db.collection(collectionName).add(body);
      return res.status(200).json({ id: docRef.id, ...body });
    }

    // PUT → aggiorna un documento esistente
    else if (req.method === 'PUT') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);

      const { id, ...updateData } = body;
      if (!id || typeof updateData !== 'object') {
        return res.status(400).json({ message: 'Body non valido: serve id e dati da aggiornare' });
      }

      await db.collection(collectionName).doc(id).update(updateData);
      return res.status(200).json({ id, ...updateData });
    }

    // DELETE → elimina un documento
    else if (req.method === 'DELETE') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);

      const { id } = body;
      if (!id) return res.status(400).json({ message: 'Serve id per eliminare il documento' });

      await db.collection(collectionName).doc(id).delete();
      return res.status(200).json({ id, message: 'Documento eliminato!' });
    }

    // Metodo non supportato
    else {
      return res.status(405).json({ message: 'Metodo non consentito' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Errore server', error: error.message });
  }
};
