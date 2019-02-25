/*
Server
*/

const express = require('express');
const multer = require('multer');
const Datastore = require('nedb');
const mkdirp = require('mkdirp');
const cors = require('cors');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');
const archiver = require('archiver')
const mongoose = require('mongoose')
const onedrive = require('./src/utils/onedrive')

const port = process.env.PORT || 8020;

const app = express();
app.use(cors());
app.use(express.json())

// Database
//let db = new Datastore({ filename: './data.db', autoload: true });

//const MONGO_URL = 'mongodb://localhost:27017/pdfviewer';
const MONGO_URL = 'mongodb://anfuente:anfuente123456@ds155213.mlab.com:55213/anfuente';
mongoose.connect(MONGO_URL, function (err, response) {
  if (err) console.log(err);
  console.log('Connected to db pdfviewer');
});


//Mkdir
mkdirp('./files/', err => {
  console.log(`Se creo la carpeta -files- en ${__dirname}`);
});

// Uploads
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

let upload_pdf = multer({ storage });

app.post('/uploadpdf', upload_pdf.single('pdf'), (req, res, next) => {
  try {
    // Imprime la entrada
    console.log();
    console.log('-------------------------------------------');
    console.log();
    console.log(req.file);

    // Creando el modelo del archivo PDF
    let date = new Date();
    let temp = req.file.originalname.split('.')[0].split('-');
    let datos = {
      company: temp[0],
      type: temp[1],
      bank: temp[2],
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      nro: parseInt(temp[3]),
      cod: temp[4],
      fulldate: date,
      path: req.file.path,
    };

    // Inserta el modelo
    db.insert(datos, (err, doc) => {
      console.log();
      console.log('-------------------------------------------');
      console.log();
      console.log(
        `PDF Insertado|Nro:${doc.nro}|Cod:${doc.cod}|Tipo:${doc.type}|Fecha:${
        doc.fulldate
        }`
      );
      console.log(doc);
    });

    res.json({
      res: true,
      pdf: req.file,
    });
  } catch (err) {
    res.sendStatus(400);
  }
});

// Routes

//Comprimir PDF

app.get('/zip/:tam/:op', function (req, res) {

  console.log();
  console.log('___________________________');
  console.log('Iniciando: Comprimir PDFS');

  const __pathtemp = `./files/temp`;
  let files = [];
  let tam = req.params.tam;
  let op = JSON.parse(req.params.op);
  for (let i = 0; i < tam; i++) {
    if(!op){
      files.push(`${__pathtemp}/out-${i}.pdf`);
    }else{
      files.push(`${__pathtemp}/out-${i+1}.pdf`);
    }
    
  }

  const archive = archiver('zip');

  archive.on('error', function (err) {
    res.status(500).send({ error: err.message });
  });

  //on stream closed we can end the request
  archive.on('end', function () {
    console.log('Archive write %d bytes', archive.pointer());
  });

  //set the archive name
  res.attachment('pdf.zip');

  //this is the streaming magic
  archive.pipe(res);

  for (const i in files) {
    archive.file(files[i], { name: path.basename(files[i]) });
  }

  archive.finalize();

  console.log();
  console.log('Finalizando: Comprimir PDFS');

});


//Iniciar proceso de Hummus
app.get('/gopdf/:filename/:divider/:join', async (req, res) => {
  console.log();
  console.log('___________________________');
  console.log('Iniciando: Proceso de Hummus');

  const hummus = require('./src/utils/hummus');

  let file = req.params.filename;

  let split = [];
  let temps = req.params.divider.split('|');
  for (let i in temps) {
    let temp = [];
    let aux = temps[i].split(',');
    temp.push(parseInt(aux[0]));
    temp.push(parseInt(aux[1]));
    split.push(temp);
  }
  let join = JSON.parse(req.params.join)

  let Hummus = new hummus(file, split, join);

  try {
    await Hummus.goPDF();
    res.json({
      res: true,
      file,
      split,
      size: split.length,
      join
    });
    console.log();
    console.log('Finalizando: Proceso de Hummus');
  } catch (err) {
    res.json({
      res: false,
      err,
    });
    console.log();
    console.log('ERROR: Proceso de Hummus');
    console.log(err);
  }
});

//Extraer todo
app.get('/extall/:filename', async (req, res) => {
  console.log();
  console.log('Iniciando: Extraer todo');

  const hummus = require('./src/utils/hummus');

  let file = req.params.filename;

  let Hummus = new hummus(file);

  try {
    await Hummus.extractAll();
    res.json({
      res: true,
      file
    });
    console.log();
    console.log('Finalizando: Proceso de Hummus | Extraer todo');
  } catch (err) {
    res.json({
      res: false,
      err,
    });
  }

});

//Eliminar carpeta temp
app.get('/deletetemp', async (req, res) => {
  console.log();
  console.log('Iniciando: Eliminar carpeta');

  const __pathtemp = `./files/temp`;
  rimraf(__pathtemp, function () {
    console.log(`Carpeta --> ${__pathtemp} eliminada`);
  });
  res.json({
    res: true,
  });

  console.log();
  console.log('Finalizando: Eliminar carpeta');
  console.log('___________________________');
});

//Consultar por Tipo (Iniciales)
app.get('/files/type/:type', async (req, res) => {
  await db.find({ type: req.params.type.toUpperCase() }, (err, doc) => {
    console.log(doc);
    res.json({
      res: true,
      doc,
    });
  });
});

//Consultar por Año
app.get('/files/year/:year', async (req, res) => {
  await db.find({ year: parseInt(req.params.year) }, (err, doc) => {
    console.log(doc);
    res.json({
      res: true,
      doc,
    });
  });
});

//Consultar por Mes
app.get('/files/month/:month', async (req, res) => {
  await db.find({ month: parseInt(req.params.month) }, (err, doc) => {
    console.log(doc);
    res.json({
      res: true,
      doc,
    });
  });
});

//Consultar todo
app.get('/files/all', async (req, res) => {
  await db.find({}, (err, doc) => {
    console.log(doc);
    res.json({
      res: true,
      doc,
    });
  });
});

//Descargar archivo
app.get('/download/:file', (req, res) => {
  let file = req.params.file;
  let filelocation = `./files/${file}`;
  console.log(`Descargando archivo --> ${filelocation}`);
  res.download(filelocation, file);
});

app.get('/downloadtemp/:file', async (req, res) => {
  console.log();
  console.log('Iniciando: Download files --> /files/temp');

  let file = req.params.file;
  let filelocation = `./files/temp/${file}`;

  try {
    console.log(`Descargando archivo --> ${filelocation}`);
    res.download(filelocation, file);
    console.log();
    console.log('Finalizando: Download files --> /files/temp');
    console.log();
  } catch (err) {
    console.log(err);
    console.log();
    console.log('ERROR: Download files --> /files/temp');
    console.log();
  }
});

//Visualizar PDF
app.get('/viewpdf/:pdf', (req, res) => {
  let tempfile = `./files/${req.params.pdf}`;
  fs.readFile(tempfile, (err, data) => {
    res.contentType('application/pdf');
    res.send(data);
  });
});

//Google Drive
app.get('/drive/all/:company/:month/:type/:year/:bank', async (req, res) => {
  const { getFilesForParams } = require('./src/utils/googledrive.js')
  let company = req.params.company
  let month = req.params.month
  let type = req.params.type
  let year = req.params.year
  let bank = req.params.bank
  let pdf = await getFilesForParams(company, month, type, year, bank)
  res.json({
    res: true,
    pdf
  })
});

app.get('/drive/download/:id/:name/:year/:number', async (req, res) => {
  const { downloadFile } = require('./src/utils/googledrive.js')
  let id = req.params.id
  let name = req.params.name
  let year = req.params.year
  let number = req.params.number
  await downloadFile(id, name, year, number)
  res.json({
    res: true
  })
});

app.get('/drive/files/:name', async (req, res) => {
  const { getFilesForName } = require('./src/utils/googledrive.js')
  let name = req.params.name
  let pdf = await getFilesForName(name)
  res.json({
    res: true,
    pdf
  })
});

app.get('/onedrive/all', async (req, res) => {
  let files = await onedrive.getFilesAll()
  res.json({
    res: true,
    pdf: files
  })
})

app.get('/onedrive/download/:id/:name', async (req, res) => {
  await onedrive.downloadFile(req.params.name, req.params.id)
  res.json({
    res: true
  })
})


//Gestion de usuarios

/*
Model Users
*/
const Schema = mongoose.Schema
const USER = mongoose.model('user', new Schema({
  name: String,
  lastname: String,
  username: String,
  password: String,
  date: Date
}));

app.get('/user/all', async (req, res) => {
  const aux = await(USER.find());
  res.json({
    res: true,
    user: aux
  });
})

app.post('/user', async (req, res) => {
  console.log(req.body)
  const aux = new USER(req.body);
  await aux.save();
  res.json({
    res: true,
    status: "Usuario guardado"
  });
})

app.get('/user/:username/:password', async (req, res) => {
  const aux = await (USER.findOne({username: req.params.username, password: req.params.password}));
  res.json({
    user: aux,
    res: true
  });
});

app.get('/users/:id', async (req, res) => {
  const aux = await (USER.findById(req.params.id));
  res.json({
    user: {
      fullname: `${aux.name} ${aux.lastname}`
    },
    res: true
  });
});

app.delete('/user/:id', async (req, res) => {
  await USER.findByIdAndRemove(req.params.id);
  res.json({
    res: true,
    status: "Usuario eliminado"
  });
})


// Static
app.use(express.static(__dirname + '/dist/'));

// Output
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
