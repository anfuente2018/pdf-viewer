const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const createWriteStream = util.promisify(fs.createWriteStream);

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly'];

let token = null
let credentials = null

const KEYS = [
     {
          year: 2018,
          number: 1,
          key: '1qAEroo-4p8Xs_cXxjAorkglNZyuI43u8',
          file_credentials: 'credentials2018_1.json',
          file_token: 'token2018_1.json'
     },
     {
          year: 2018,
          number: 2,
          key: '1jbNj7KJoaurrTo3uhtxf9oCT-vM2IdHY',
          file_credentials: 'credentials2018_2.json',
          file_token: 'token2018_2.json'
     },
     {
          year: 2017,
          number: 1,
          key: '1R4hL2Tr4gOHQ4XVb7JKJes2y16zkdgor',
          file_credentials: 'credentials2017_1.json',
          file_token: 'token2017_1.json'
     },
     {
          year: 2017,
          number: 2,
          key: '14uDxGXqF6fNow6Zw6Se2L3YcvT_9ZQmC',
          file_credentials: 'credentials2017_2.json',
          file_token: 'token2017_2.json'
     },
     {
          year: 2016,
          number: 1,
          key: '1dVd148rkJg6C_VaT4__xVKJaZL7qtslu',
          file_credentials: 'credentials2016_1.json',
          file_token: 'token2016_1.json'
     },
     {
          year: 2016,
          number: 2,
          key: '1p28WptXNZDxKjfmblYltWHA48xsMW8-b',
          file_credentials: 'credentials2016_2.json',
          file_token: 'token2016_2.json'
     },
     {
          year: 2015,
          number: 1,
          key: '1XTy_SRosLWdO5guqcRYGiHH_yU8MrQY8',
          file_credentials: 'credentials2015_1.json',
          file_token: 'token2015_1.json'
     },
     {
          year: 2015,
          number: 2,
          key: '14hn5GgJnQb8GdS1EInWMLd48I17hi4Ly',
          file_credentials: 'credentials2015_2.json',
          file_token: 'token2015_2.json'
     }
]


async function init(year, number) {

     let aux = await KEYS.find(res => res.year == year && res.number == number)

     console.log(aux)

     //const TOKEN_PATH = __dirname + '/token2018_1.json';
     //const TOKEN_PATH = `${__dirname}/${aux.file_token}`;
     token = `${__dirname}/${aux.file_token}`;
     //const CREDENTIALS_PATH = __dirname + '/credentials2018_1.json';
     //const CREDENTIALS_PATH = `${__dirname}/${aux.file_credentials}`;
     credentials = `${__dirname}/${aux.file_credentials}`;

     console.log(token)
     console.log(credentials)

     return await readFile(credentials, 'utf8')
          .then(async content => {
               return await authorize(JSON.parse(content));
          })
          .catch(err => {
               console.log(err)
          })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials) {
     const { client_secret, client_id, redirect_uris } = credentials.installed;
     const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0]);

     return await readFile(token, 'utf8')
          .then(async token => {
               oAuth2Client.setCredentials(JSON.parse(token));
               console.log('go go')
               return await oAuth2Client;
          })
          .catch(err => {
               console.log(err)
          })
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
exports.getFilesForParams = async function getFilesForParams(company, month, type, year, bank) {


     let arrayFiles = []

     let auth1 = await init(parseInt(year),1)
     const drive = await google.drive({ version: 'v3', auth: auth1 });
     let aux = await KEYS.find(res => res.year == year && res.number == 1)
     let getCompany = await getFolder(drive, company, aux.key);
     let getMonth = await getFolder(drive, month, getCompany);
     let getType = await getFolder(drive, type, getMonth);
     let getFiles = null
     if(type == 'Cheque'){
          let getBank = await getFolder(drive, bank, getType);
          if(getBank != '0'){
               getFiles = await getFilesAll(drive, getBank, year, 1);
          }
          
     }else{
          getFiles = await getFilesAll(drive, getType, year, 1);     
     }
     
     if(getFiles != '0'){
          for (let i in getFiles) {
               arrayFiles.push(getFiles[i])
          }
     }
     

     let auth2 = await init(parseInt(year), 2)
     const drive2 = await google.drive({ version: 'v3', auth: auth2 });
     let aux2 = await KEYS.find(res => res.year == year && res.number == 2)
     let getCompany2 = await getFolder(drive2, company, aux2.key);
     let getMonth2 = await getFolder(drive2, month, getCompany2);
     let getType2 = await getFolder(drive2, type, getMonth2);
     let getFiles2 = null
     if(type == 'Cheque'){
          let getBank2 = await getFolder(drive, bank, getType2);
          if (getBank2 != '0') {
               getFiles2 = await getFilesAll(drive, getBank2, year, 2);
          }
          
     }else{
          getFiles2 = await getFilesAll(drive2, getType2, year, 2);
     }
     
     if (getFiles2 != '0') {
          for (let i in getFiles2) {
               arrayFiles.push(getFiles2[i])
          }
     }
     

     return arrayFiles

}


async function getFolder(drive, name, id) {

     let idk = ''

     const res = await drive.files.list({
          q: `'${id}' in parents`,
          fields: 'nextPageToken, files(id, name), files/parents',
     });
     const files = res.data.files;
     if (files.length) {
          files.map((file) => {
               if (file.name == name) {
                    console.log(`${file.name} --> (${file.id})`);
                    idk = file.id
               }
          });
     } else {
          console.log('No files found.');
          idk = '0'
     }
     return idk;

}

async function getFilesAll(drive, id, year, number) {

     let idk = []

     const res = await drive.files.list({
          q: `'${id}' in parents`,
          fields: 'nextPageToken, files(id, name), files/parents',
          pageSize: 1000
     });
     const files = res.data.files;
     if (files.length) {
          files.map((file) => {
               console.log(`${file.name} --> (${file.id})`);
               idk.push({
                    name: file.name,
                    id: file.id,
                    year, 
                    number
               })
          });
          console.log(`Archivos encontrados --> ${idk.length}`)
     } else {
          console.log('No files found.');
          idk = '0'
     }
     
     return idk;

}

exports.getFilesForName = async function getFilesForName(name) {

     let arrayFiles = []

     let res1 = await filter(2018, 1, name)
     for (let i in res1) {
          arrayFiles.push(res1[i])
     }

     let res2 = await filter(2018, 2, name)
     for (let i in res2) {
          arrayFiles.push(res2[i])
     }

     let res3 = await filter(2017, 1, name)
     for (let i in res3) {
          arrayFiles.push(res3[i])
     }

     let res4 = await filter(2017, 2, name)
     for (let i in res4) {
          arrayFiles.push(res4[i])
     }

     let res5 = await filter(2016, 1, name)
     for (let i in res5) {
          arrayFiles.push(res5[i])
     }

     let res6 = await filter(2016, 2, name)
     for (let i in res6) {
          arrayFiles.push(res6[i])
     }

     let res7 = await filter(2015, 1, name)
     for (let i in res7) {
          arrayFiles.push(res7[i])
     }

     let res8 = await filter(2015, 2, name)
     for (let i in res8) {
          arrayFiles.push(res8[i])
     }

     return arrayFiles

}

async function filter(year, number, name){

     let idk = []

     let auth = await init(year, number)
     const drive = await google.drive({ version: 'v3', auth: auth });
     
     const res = await drive.files.list({
          q: `name contains '${name}' and mimeType != 'application/vnd.google-apps.folder'`,
          fields: 'nextPageToken, files(id, name), files/parents',
          pageSize: 1000
     });
     const files = res.data.files;
     if (files.length) {
          files.map((file) => {
               console.log(`${file.name} --> (${file.id})`);
               idk.push({
                    name: file.name,
                    id: file.id,
                    year,
                    number
               })
          });
          console.log(`Archivos encontrados --> ${idk.length}`)
     } else {
          console.log('No files found.');
     }

     return idk
}


/**
 @param {drive} drive The OAuth2 client to get token for.
 @param {fileId}  fileId Id del archivo a descargar
 @param {name}  name Nombre del archivo a descargar
 */
exports.downloadFile = async function downloadFile(fileId, name, year, number) {
     let auth = await init(parseInt(year), parseInt(number))
     const drive = await google.drive({ version: 'v3', auth });

     await new Promise(async resolve => {
          await drive.files.get(
               { fileId: fileId, alt: 'media', mimeType: 'application/pdf' },
               { responseType: 'stream' },
               async (err, res) => {
                    await res.data
                         .pipe(fs.createWriteStream(`files/${name}`))
                         .on('end', () => {
                              console.log(`Archivo descargado de Google Drive -->`)
                         })
                         .on('error', err => {
                              console.log('Error', err);
                         })
                         .on('finish', resolve)
               })
     })


}






