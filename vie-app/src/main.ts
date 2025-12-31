import { placeholder, VERSION } from 'vie';

console.log('VIE Application démarrée');
console.log('Version de la bibliothèque:', VERSION);
console.log('Message:', placeholder());

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <h1>VIE - Vérification Informatique des Équipes</h1>
    <p>Version de la bibliothèque: ${VERSION}</p>
    <p>Message: ${placeholder()}</p>
  `;
}
