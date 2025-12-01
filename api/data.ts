// /api/data.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data.json');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const newData = JSON.parse(body);
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
      res.status(200).json({ message: 'Salvato!' });
    });
  } else {
    res.status(405).json({ message: 'Metodo non consentito' });
  }
};
