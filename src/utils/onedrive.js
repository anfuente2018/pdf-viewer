const onedrive = require("onedrive-api");
const fs = require("fs");

const token = `eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFDRWZleFh4amFtUWIzT2VHUTRHdWd2RkNBWkV2TEMtZ2EzLXBEaG5BaGFGZTRMY1gtQ1F0RURCYlR5aG5VWjdXNGNDY2lvd1lIQkhFbEdmaGFTMkJBWThHTmpET1FwZF9LUnJFXzhtSll5WlNBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiLXN4TUpNTENJRFdNVFB2WnlKNnR4LUNEeHcwIiwia2lkIjoiLXN4TUpNTENJRFdNVFB2WnlKNnR4LUNEeHcwIn0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82YmMyNzE5Yy1kZTVlLTRkOWUtYWVhMC00NzM1NTNmYzk1MmUvIiwiaWF0IjoxNTUxMjQ0MjI4LCJuYmYiOjE1NTEyNDQyMjgsImV4cCI6MTU1MTI0ODEyOCwiYWlvIjoiNDJKZ1lEaDdKNmxrM3NkblFna0xucXpZTWMvb0dRQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJwZGYtdmlld2VyIiwiYXBwaWQiOiI3YTI2NDExZC04OTQ1LTQ5N2QtOWJkZi0xOTE4NThjNjRiZjAiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82YmMyNzE5Yy1kZTVlLTRkOWUtYWVhMC00NzM1NTNmYzk1MmUvIiwib2lkIjoiYzFkZTRjYTgtMGJmMC00NmQ2LWIyM2ItMWMwMDlkYzllMGI2Iiwicm9sZXMiOlsiVXNlci5SZWFkV3JpdGUuQWxsIiwiRmlsZXMuUmVhZFdyaXRlLkFsbCIsIlVzZXIuUmVhZC5BbGwiLCJGaWxlcy5SZWFkLkFsbCJdLCJzdWIiOiJjMWRlNGNhOC0wYmYwLTQ2ZDYtYjIzYi0xYzAwOWRjOWUwYjYiLCJ0aWQiOiI2YmMyNzE5Yy1kZTVlLTRkOWUtYWVhMC00NzM1NTNmYzk1MmUiLCJ1dGkiOiJyckNSbWhva3lVaWxpUWprdVZjWkFBIiwidmVyIjoiMS4wIiwieG1zX3RjZHQiOjE1MzQxNzEzODZ9.fn5c0q8FCPbCN7hLNWT10xz0GBJJb2nruSRLSxDmcffAt6vQatTPZ_jPNvwVmNUSX8i3YiEAYEdkLQm6DM-PCTs6vhQty1ovGkVIoBGbO3zMskOUyjIfIgzx7gaOKEduRVAPi_7abxMO37sREvX3PuuBN5qr_WTjOxa7lD98MPbWGEFgw0_mcw29bZZW4mjJ3IVangmW3ojCWOWZWyYqmQa4ZMBJZ8H3vKkw_Ub-15XoQ9G3tMDsxYDs5hfe9mcVUhoeTyJU0SK8n8HU3zaVv_IMHEAT11_3lUlQrSanKf7VA6MxseXL9hhrkZ06_xeKj06NjzpGWmqaZyDPG4TdBw`;
const idFolderRoot = "017R6ELVIN6OMMV3ONY5CJXPIIKSYJRT4R";
const idUser = '8b3b3ca1-a523-4112-89fd-cf86979462a5';
const isShared = true 


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

exports.getFilesAll = async function getFilesAll() {
  let year = await getFolders(idFolderRoot, "2015");
  console.log("Paso 1");
  let company = await getFolders(year, "Empresa 1");
  console.log("Paso 2");
  let month = await getFolders(company, "Enero");
  console.log("Paso 3");
  let type = await getFolders(month, "Factura");
  console.log("Paso 4");
  let files = await getFiles(type);
  console.log(files);
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

//getFilesAll()
