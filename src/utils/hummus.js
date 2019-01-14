//HummusJS
const HummusRecipe = require('hummus-recipe');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const axios = require('axios');

//Rutas
const __path = `${__dirname}/../../files`;
const __pathtemp = `${__path}/temp`;
const __fileproa = `${__path}/proa.pdf`;
const __fileproatwo = `${__path}/proatwo.pdf`;
const __intext = 'in';
const __outext = 'out';
const __outpdftext = 'outpdf';

module.exports = class Hummus {

    constructor(file, is_split, is_join){
        this.file = file;
        this.is_split = is_split;
        this.is_join = is_join;
    }

    //Dividir file y contenerlo en la carpeta temp
    splitPDF(isAll){
        const pdfDoc = new HummusRecipe(`${__path}/${this.file}`);
   
        pdfDoc
        .split(__pathtemp, isAll ? __outext : __intext)
        .endPDF();
    }

    //Crea la carpeta temp si no existe, y si, la elimina para crearla de nuevo
    async createFolder(){
        if (!fs.existsSync(__pathtemp)) {
            try {
                await fs.mkdirSync(__pathtemp);
                console.log(`Carpeta --> ${__pathtemp} creada`)
            }
            catch (e) {
                mkdirpath(path.dirname(__pathtemp));
                mkdirpath(__pathtemp);
            }
        } else {
            rimraf(dirPath, async () => {
                console.log(`Carpeta --> ${__pathtemp} eliminada`);
                await fs.mkdirSync(dirPath);
                console.log(`Carpeta --> ${__pathtemp} creada`)
                
            });
        }
    }

    //Elimina la carpeta temp con todo y contenido
    deleteFolder() {
        rimraf(__pathtemp, function () {
            console.log(`Carpeta --> ${__pathtemp} eliminada`);
        });
    }

    //Retorna la informacion de cualquier PDF en la carpeta files
    infoPDF(){
        const pdfDoc = new HummusRecipe(`${__path}/${this.file}`, `${__path}/info-${this.file}`);
        return pdfDoc.metadata;
    }

    //Retorna el numero de paginas de un PDF
    infoPagesPDF(){
        const pdfDoc = new HummusRecipe(`${__path}/${this.file}`, `${__path}/info-${this.file}`);
        let pag = 0;
        for (let i in pdfDoc.metadata){
            if(pdfDoc.metadata[i].pageNumber){
                pag = pdfDoc.metadata[i].pageNumber
            }
            
        }
        rimraf(`${__path}/info-${this.file}`, () => {
            console.log(`Archivo --> ${__path}/info-${this.file} eliminado`);
        });
        
        return pag;
    }

    //Unir PDF
    //[1, 3], [4, 7], [9, 10]
    joinPDF() {

        const aux = this.is_split;

        for (let i in aux){
            const pdfDoc = new HummusRecipe(`${__pathtemp}/${__intext}-${aux[i][0]}.pdf`, `${__pathtemp}/${__outext}-${i}.pdf`);

            for (let j = aux[i][0] + 1; j <= aux[i][1]; j++){
                pdfDoc.appendPage(`${__pathtemp}/${__intext}-${j}.pdf`)
            }
            pdfDoc.endPDF();
        }
    }

    //Unir los PDF separados
    isJoinPDF(){
        let size = this.is_split.length
        const pdfDoc = new HummusRecipe(`${__pathtemp}/${__outext}-0.pdf`, `${__pathtemp}/${__outpdftext}.pdf`);
        for (let i = 1; i < size; i++) {
            pdfDoc.appendPage(`${__pathtemp}/${__outext}-${i}.pdf`)
        }
        pdfDoc.endPDF();
    }

   //Procesar el PDF
    async goPDF(){

        await this.createFolder();
        await this.splitPDF(false);
        await this.joinPDF();
        console.log(this.is_join)
        if(this.is_join){
            await this.isJoinPDF();
        }

    }

    async extractAll(){
        await this.createFolder();
        await this.splitPDF(true);
    }

}



