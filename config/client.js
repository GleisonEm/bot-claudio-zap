// config.js
const { Client, LocalAuth } = require('whatsapp-web.js'); // Substitua 'sua-lib-client' pelo nome real da sua biblioteca

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: true, args: ['--no-sandbox'], executablePath: '/usr/bin/google-chrome', }
// });

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: true, args: ['--no-sandbox'], executablePath: '/usr/bin/google-chrome-stable', }
// });

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'], executablePath: '/usr/bin/chromium-browser', }
});


// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: true, args: ['--no-sandbox'], executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' }
// });

module.exports = client;
