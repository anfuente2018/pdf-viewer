const onedrive = require("onedrive-api");
const fs = require("fs");
const request = require("request");

let token = `eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFDRWZleFh4amFtUWIzT2VHUTRHdWd2RkNBWkV2TEMtZ2EzLXBEaG5BaGFGZTRMY1gtQ1F0RURCYlR5aG5VWjdXNGNDY2lvd1lIQkhFbEdmaGFTMkJBWThHTmpET1FwZF9LUnJFXzhtSll5WlNBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiLXN4TUpNTENJRFdNVFB2WnlKNnR4LUNEeHcwIiwia2lkIjoiLXN4TUpNTENJRFdNVFB2WnlKNnR4LUNEeHcwIn0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82YmMyNzE5Yy1kZTVlLTRkOWUtYWVhMC00NzM1NTNmYzk1MmUvIiwiaWF0IjoxNTUxMjQ0MjI4LCJuYmYiOjE1NTEyNDQyMjgsImV4cCI6MTU1MTI0ODEyOCwiYWlvIjoiNDJKZ1lEaDdKNmxrM3NkblFna0xucXpZTWMvb0dRQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJwZGYtdmlld2VyIiwiYXBwaWQiOiI3YTI2NDExZC04OTQ1LTQ5N2QtOWJkZi0xOTE4NThjNjRiZjAiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82YmMyNzE5Yy1kZTVlLTRkOWUtYWVhMC00NzM1NTNmYzk1MmUvIiwib2lkIjoiYzFkZTRjYTgtMGJmMC00NmQ2LWIyM2ItMWMwMDlkYzllMGI2Iiwicm9sZXMiOlsiVXNlci5SZWFkV3JpdGUuQWxsIiwiRmlsZXMuUmVhZFdyaXRlLkFsbCIsIlVzZXIuUmVhZC5BbGwiLCJGaWxlcy5SZWFkLkFsbCJdLCJzdWIiOiJjMWRlNGNhOC0wYmYwLTQ2ZDYtYjIzYi0xYzAwOWRjOWUwYjYiLCJ0aWQiOiI2YmMyNzE5Yy1kZTVlLTRkOWUtYWVhMC00NzM1NTNmYzk1MmUiLCJ1dGkiOiJyckNSbWhva3lVaWxpUWprdVZjWkFBIiwidmVyIjoiMS4wIiwieG1zX3RjZHQiOjE1MzQxNzEzODZ9.fn5c0q8FCPbCN7hLNWT10xz0GBJJb2nruSRLSxDmcffAt6vQatTPZ_jPNvwVmNUSX8i3YiEAYEdkLQm6DM-PCTs6vhQty1ovGkVIoBGbO3zMskOUyjIfIgzx7gaOKEduRVAPi_7abxMO37sREvX3PuuBN5qr_WTjOxa7lD98MPbWGEFgw0_mcw29bZZW4mjJ3IVangmW3ojCWOWZWyYqmQa4ZMBJZ8H3vKkw_Ub-15XoQ9G3tMDsxYDs5hfe9mcVUhoeTyJU0SK8n8HU3zaVv_IMHEAT11_3lUlQrSanKf7VA6MxseXL9hhrkZ06_xeKj06NjzpGWmqaZyDPG4TdBw`;
const idFolderRoot = "017R6ELVIN6OMMV3ONY5CJXPIIKSYJRT4R";
const idUser = "8b3b3ca1-a523-4112-89fd-cf86979462a5";
const isShared = true;

async function getFolders(id, name) {
  let response = null;

  if (!id) {
    return null;
  }

  try {
    let childrens = await onedrive.items.listChildren({
      accessToken: token,
      itemId: id,
      shared: isShared,
      user: idUser
    });

    //console.log(childrens)

    for (let item of childrens.value) {
      if (item.name == name) {
        response = item.id;
      }
    }

    return response;
  } catch (error) {
    console.log(error);
  }
}

async function getFiles(id) {
  let response = [];

  if (!id) {
    return null;
  }

  try {
    let childrens = await onedrive.items.listChildren({
      accessToken: token,
      itemId: id,
      shared: isShared,
      user: idUser
    });

    for (let item of childrens.value) {
      var temp = {
        name: item.name.split(".pdf")[0],
        id: item.id
      };
      response.push(temp);
    }

    return response;
  } catch (error) {
    console.log(error);
  }
}

exports.getFilesAll = async function getFilesAll(datos) {
  let file = [];

  let isActiveToken = await validateToken();
  if (!isActiveToken) {
    return null;
  }

  let year = await getFolders(idFolderRoot, datos.year);
  console.log("Paso 1");
  let company = await getFolders(year, datos.company);
  console.log("Paso 2");
  let month = await getFolders(company, datos.month);
  console.log("Paso 3");
  let type = await getFolders(month, datos.type);
  console.log("Paso 4");

  if (datos.type == "Cheque") {
    let bank = await getFolders(type, datos.bank);
    console.log("Paso 5");
    files = await getFiles(bank);
    console.log(files);
  } else {
    files = await getFiles(type);
    console.log(files);
  }

  return files;
};

exports.downloadFile = async function downloadFile(name, id) {
  await new Promise(async resolve => {
    let fileStream = await onedrive.items.download({
      accessToken: token,
      itemId: id,
      shared: isShared,
      user: idUser
    });

    await fileStream
      .pipe(fs.createWriteStream(`files/${name}.pdf`))
      .on("end", () => {
        console.log(`Archivo descargado de Google Drive -->`);
      })
      .on("error", err => {
        console.log("Error", err);
      })
      .on("finish", resolve);
  });
};

async function getNewToken() {
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  };

  let options = {
    url:
      "https://login.microsoftonline.com/6bc2719c-de5e-4d9e-aea0-473553fc952e/oauth2/v2.0/token",
    method: "POST",
    headers: headers,
    form: {
      client_id: "7a26411d-8945-497d-9bdf-191858c64bf0",
      scope: "https://graph.microsoft.com/.default",
      client_secret: "TPXDS5#_pnpkineQU5235={",
      grant_type: "client_credentials"
    }
  };

  return new Promise((resolve, reject) => {
    request(options, function(error, response, body) {
      if (error) {
        console.log(error);
        reject(false);
      }
      console.log(JSON.parse(body).access_token);
      token = JSON.parse(body).access_token;
      resolve(true);
    });
  });
}

async function verificateToken() {
  try {
    let childrens = await onedrive.items.listChildren({
      accessToken: token,
      itemId: idFolderRoot,
      shared: isShared,
      user: idUser
    });

    return 1;
  } catch (err) {
    if (err.error.error.code == "InvalidAuthenticationToken") {
      console.log("Token expirado");
      return 2;
    } else {
      console.log(err.error.error.code);
      return 3;
    }
  }
}

async function validateToken() {
  let isActive = await verificateToken();
  let response = null;
  if (isActive == 1) {
    console.log("Token activo");
    response = true;
  } else if (isActive == 2) {
    console.log("Token invalido");
    console.log("Generando nuevo token");
    response = await getNewToken();
    //response = true
  } else {
    console.log("Error interno");
    response = false;
  }

  return response;
}

exports.getFileForFilter = async function getFileForFilter(text) {

  let isActiveToken = await validateToken();
  if (!isActiveToken) {
    return null;
  }

  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Bearer ${token}`
  };

  let options = {
    url:
      `https://graph.microsoft.com/v1.0/users/8b3b3ca1-a523-4112-89fd-cf86979462a5/drive/root/search(q='${text}')?select=name,id`,
    method: "GET",
    headers: headers,
    form: {}
  };

  return new Promise((resolve, reject) => {
    request(options, function(error, response, body) {
      if (error) {
        console.log(error);
        reject(null);
      }
      let data = JSON.parse(body).value
      let res = []

      for(let item of data){
        let isValid = new RegExp(`${text.toLowerCase()}`).test(item.name.toLowerCase())
        if(isValid) res.push(item)
      }
      
      resolve(res);
    });
  });
}

//getNewToken()
