import fs from 'fs';
import path from 'path';
import { VercelRequest, VercelResponse } from '@vercel/node';

const filePath = path.join(process.cwd(), 'public/data.json');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const data = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const newData = JSON.parse(body);
    await fs.promises.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8');
    res.status(200).json({ message: 'Salvato!' });
  } else {
    res.status(405).json({ message: 'Metodo non consentito' });
  }
}
