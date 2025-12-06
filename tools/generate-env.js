const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const targetPath = './src/environments/environment.ts';

const envFileContent = `
export const environment = {
  production: false,
  apiUrl: '${process.env.API_URL}'
};
`;

fs.writeFileSync(targetPath, envFileContent);
console.log('✔ environment.ts generated from .env');
