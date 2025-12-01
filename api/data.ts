import { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';

// Leggi il service account dalle variabili d'ambiente
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

// Inizializza Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const collectionName = 'items'; // nome della collection su Firestore

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const snapshot = await db.collection(collectionName).get();
      const data: any[] = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      res.status(200).json(data);

    } else if (req.method === 'POST') {
      const body = req.body; // JSON inviato da Angular
      const docRef = await db.collection(collectionName).add(body);
      res.status(200).json({ id: docRef.id, ...body });

    } else if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      await db.collection(collectionName).doc(id).update(updateData);
      res.status(200).json({ id, ...updateData });

    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      await db.collection(collectionName).doc(id).delete();
      res.status(200).json({ id, message: 'Eliminato!' });

    } else {
      res.status(405).json({ message: 'Metodo non consentito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore server', error });
  }
}
