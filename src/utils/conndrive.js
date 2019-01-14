const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly'];
const TOKEN_PATH = __dirname + '/token2019_1.json';
const CREDENTIALS_PATH = __dirname + '/credentials2019_1.json';

con = fs.readFile(CREDENTIALS_PATH, (err, content) => {
     if (err) return console.log('Error loading client secret file:', err);
     authorize(JSON.parse(content));
});

function authorize(credentials, callback) {
     const { client_secret, client_id, redirect_uris } = credentials.installed;
     const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0]);

     fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) return getAccessToken(oAuth2Client);
          oAuth2Client.setCredentials(JSON.parse(token));
     });
}

function getAccessToken(oAuth2Client) {
     const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
     });
     console.log('Authorize this app by visiting this url:', authUrl);
     const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
     });
     rl.question('Enter the code from that page here: ', (code) => {
          rl.close();
          oAuth2Client.getToken(code, (err, token) => {
               if (err) return console.error('Error retrieving access token', err);
               oAuth2Client.setCredentials(token);
               // Store the token to disk for later program executions
               fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
               });
          });
     });
}






