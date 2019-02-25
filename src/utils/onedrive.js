const onedrive = require("onedrive-api");
const fs = require("fs");

const token = `eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFDRWZleFh4amFtUWIzT2VHUTRHdWd2WFIwb05KWEh6RDVKZkNHdHk1ZWhVTHFubnR0UTNSNk1qZGt5RGNDOXcwRFNDSExRTU1KQ2hIb1RBVm1pOElsOXY5NGFvQUlVTFhEMWUybktwcjU1eFNBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiLXN4TUpNTENJRFdNVFB2WnlKNnR4LUNEeHcwIiwia2lkIjoiLXN4TUpNTENJRFdNVFB2WnlKNnR4LUNEeHcwIn0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82YmMyNzE5Yy1kZTVlLTRkOWUtYWVhMC00NzM1NTNmYzk1MmUvIiwiaWF0IjoxNTUxMDU0NTM5LCJuYmYiOjE1NTEwNTQ1MzksImV4cCI6MTU1MTA1ODQzOSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhLQUFBQW1oejVzdzZZdDdkWnRzUk5JVVVwaHd1VEZHVGdqTFBRTmJPNURKcW5JSnM9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJwZGYtdmlld2VyIiwiYXBwaWQiOiI3YTI2NDExZC04OTQ1LTQ5N2QtOWJkZi0xOTE4NThjNjRiZjAiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IlBhZHLDs24iLCJnaXZlbl9uYW1lIjoiSGFycnkiLCJpcGFkZHIiOiIxOTAuMjA2LjEwOC4yNCIsIm5hbWUiOiJIYXJyeSBQYWRyw7NuIiwib2lkIjoiOGIzYjNjYTEtYTUyMy00MTEyLTg5ZmQtY2Y4Njk3OTQ2MmE1Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTE0NTQ0NzExNjUtNzkwNTI1NDc4LTcyNTM0NTU0My0xMjY1NzI5IiwicGxhdGYiOiIxNCIsInB1aWQiOiIxMDAzM0ZGRkFERDA0ODAwIiwic2NwIjoiQWdyZWVtZW50LlJlYWQuQWxsIEZpbGVzLlJlYWRXcml0ZS5BbGwgRmlsZXMuUmVhZFdyaXRlLkFwcEZvbGRlciBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgVXNlci5SZWFkV3JpdGUuQWxsIHByb2ZpbGUgb3BlbmlkIGVtYWlsIiwic3ViIjoiQlVlcEF5N3lkcmxiV0RWOXc5aFlhdVZGWGlhVVRoY2daN21xVl9Sc3J4SSIsInRpZCI6IjZiYzI3MTljLWRlNWUtNGQ5ZS1hZWEwLTQ3MzU1M2ZjOTUyZSIsInVuaXF1ZV9uYW1lIjoiaFBhZHJvbkBuYXZpZXJhc2JyLmNvbSIsInVwbiI6ImhQYWRyb25AbmF2aWVyYXNici5jb20iLCJ1dGkiOiIxeUhJcTNNU1lVR29ISGRvVzdCX0FBIiwidmVyIjoiMS4wIiwieG1zX3N0Ijp7InN1YiI6IllIS3VNSWxZdy1CLUVwdjRvOU1lc19RWEo4NEFMaEFEbERBWVRhYzRjM0kifSwieG1zX3RjZHQiOjE1MzQxNzEzODZ9.Wp3fyt7XdJXIbBjMt6L5VtIGEXBKTBMp1bs4sHJSJe0506pdojZrEQ6OgFvBIyoNJobphXJnZEn3UgTT82fax0P-CGImkC1kTX1wO-Zbb1icXX4r_AeNT-0KkGTALjTXrmpkLOUcJ7OaO73zE5BKVdJe_PrjhnfZ3hexdPgpHsVJGur2g6UJQYXSGZtPAu-gPT9_4gkN8yqmQWtHQXtXgJsJEngBIvpoN0-xbiWs3WUHlgKvCBOkSuRW21MwJlJD02IJ-hd49kEnJbW3Rfn-Y1i0PXx_CsT3cbXxRsnFlQJN6HEv_vJimpi7Hg031WzzZYMZgzHrD69eCmN6OWZUyw`;
const idFolderRoot = "017R6ELVIN6OMMV3ONY5CJXPIIKSYJRT4R";

async function getFolders(id, name) {
  let response = null;

  if (!id) {
    return null;
  }

  try {
    let childrens = await onedrive.items.listChildren({
      accessToken: token,
      itemId: id
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
      itemId: id
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
      itemId: id
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
