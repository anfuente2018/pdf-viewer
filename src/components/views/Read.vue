<template>
<div>

    <!-- READ -->

   <div v-show="show_read==true">
      
      <div class="field center">
        <b-switch v-model="is_auto"
        type="is-primary">
              Busqueda automatica
        </b-switch>
      </div>

      <section v-if="is_auto==false">
            <b-tabs v-model="activeTab" position="is-centered" type="is-boxed" @change="viewActiveTab">

                  <b-tab-item label="Empresa" icon="building" icon-pack="fas" :disabled="isactivetab[0]" class="">
                        <p class="buttons center">
                          <a class="button is-large" v-for="(item, index) in company" :key="index" @click="next(`company:${item.name_internal}`)">
                            <span class="icon is-medium">
                                  <i class="fas fa-folder"></i>
                            </span>
                            <span>{{item.name_public}}</span>
                          </a>
                        </p>
                  </b-tab-item>

                  <b-tab-item label="Tipo" icon="list-alt" icon-pack="fas" :disabled="isactivetab[1]" class="tabitem">
                        <p class="buttons center">
                          <a class="button is-large btnmaxx" v-for="(item, index) in names" :key="index" @click="next(`type:${item.name}`)">
                            <span class="icon is-medium">
                                  <i class="fas fa-folder"></i>
                            </span>
                            <span>{{item.name}}</span>
                          </a>
                        </p>
                  </b-tab-item>

                  <b-tab-item label="Banco" icon="archway" icon-pack="fas" :disabled="isactivetab[2]" class="">
                        <p class="buttons center">
                          <a class="button is-large" v-for="(item, index) in banks" :key="index" @click="next(`bank:${item.name_internal}`)">
                            <span class="icon is-medium">
                                  <i class="fas fa-folder"></i>
                            </span>
                            <span>{{item.name_public}}</span>
                          </a>
                        </p>
                  </b-tab-item>

                  <b-tab-item label="Año" icon="calendar-alt" icon-pack="fas" :disabled="isactivetab[3]" class="tabitem">
                        <p class="buttons center">
                          <a class="button is-large btnmax" v-for="(item, index) in years" :key="index" @click="next(`year:${item}`)">
                            <span class="icon is-medium">
                                  <i class="fas fa-folder"></i>
                            </span>
                            <span>{{item}}</span>
                          </a>
                        </p>
                  </b-tab-item>

                  <b-tab-item label="Mes" icon="clock" icon-pack="fas" :disabled="isactivetab[4]" class="tabitem">
                        <p class="buttons center">
                          <a class="button is-large btnmaxx" v-for="(item, index) in months" :key="index" @click="finalize(`month:${item.name}`)">
                            <span class="icon is-medium">
                                  <i class="fas fa-folder"></i>
                            </span>
                            <span>{{item.name}}</span>
                          </a>
                        </p>
                  </b-tab-item>

                  <b-tab-item label="PDF" icon="file-pdf" icon-pack="fas" :disabled="isactivetab[5]">
                        <p class="buttons center">
                          <a class="button is-large" v-for="(item, index) in datatemp" :key="index" @click="downloadFileForId(item.id, item.name)">
                            <span class="icon is-medium">
                                  <i class="fas fa-file-pdf"></i>
                            </span>
                            <span>{{item.name}}</span>
                          </a>
                        </p>
                  </b-tab-item>

            </b-tabs>
      </section>

      <div v-else> 

        <div class="center">
          <b-field label="Introduzca el nombre del archivo y presione enter: ">
            <b-input @keyup.enter.native="searchForFilter()" placeholder="Buscar"
                  type="text"
                  icon-pack="fas"
                  icon="search"
                  maxlength="50"
                  rounded
                  v-model="filtersearch"
                  expanded
                  class="input-filter">
              </b-input>
          </b-field>
        </div>
        
        <section>
            <p class="buttons center">
              <a class="button is-large" v-for="(item, index) in datatempfilter" :key="index" @click="downloadFileForId(item.id, item.name)">
                <span class="icon is-medium">
                      <i class="fas fa-file-pdf"></i>
                </span>
                <span>{{item.name}}</span>
              </a>
            </p>
      </section>
      </div>

      
   </div>

   <!-- EDITOR -->

   <div class="container" v-show="show_read==false">
    <div class="columns part-one">

        <div class="column is-5">
            
            <div class="card">
                <div class="card-content">

                    <div class="block center">

                        <b-checkbox v-model="show" size="is-medium" class="space"></b-checkbox>

                        <a class="button" @click="page != 1 ? page-- : page = page">
                            <span class="icon is-small">
                            <i class="fas fa-chevron-circle-left"></i>
                            </span>
                        </a>
                        <a class="button space" @click="page != numPages ? page++ : page = page">
                            <span class="icon is-small">
                            <i class="fas fa-chevron-circle-right"></i>
                            </span>
                        </a>

                        <b-tag type="is-info" size="is-medium" class="space">{{page}}/{{numPages}}</b-tag>

                        <!--<a class="button space" @click="$refs.pdf.print()">
                            <span class="icon is-small">
                            <i class="fas fa-print"></i>
                            </span>
                        </a>-->

                        <a class="button" :href="src" target="_blank">
                            <span class="icon is-small">
                            <i class="fas fa-external-link-alt"></i>
                            </span>
                        </a>

                    </div>
                    
                    <div style="width: 85%">
                        <div v-if="false">
                          Cargando
                        </div>
                        <div>
                          <pdf 
                            v-if="show" 
                            ref="pdf" 
                            :src="src" 
                            :page="page" 
                            @progress="loadedRatio = $event" 
                            @error="error" 
                            @num-pages="numPages = $event" 
                            @link-clicked="page = $event">
                          </pdf>
                        </div>
                        
                    </div>

                </div>
            </div>

        </div>

        <div class="column is-7">

            <div class="card center">
                <div class="card-content">
                    
                    <b-field>
                        <b-radio-button v-model="show_edit"
                            native-value="all"
                            type="is-info">
                            <b-icon icon="download" pack="fas"></b-icon>
                            <span>Extraer todas las paginas</span>
                        </b-radio-button>

                        <b-radio-button v-model="show_edit"
                            native-value="divide"
                            type="is-success">
                            <b-icon icon="divide" pack="fas"></b-icon>
                            <span>Dividir por rango</span>
                        </b-radio-button>
                    </b-field>

                    <div v-if="show_edit=='all'" class="space-v">
                        <div class="has-text-centered">
                            <a @click="extractAll()" class="button is-vcentered is-medium is-info is-outlined is-rounded">Extraer todas las paginas</a>
                            <div class="has-text-centered space-v">
                                <a @click="backRead()" class="button is-vcentered is-small is-warning is-rounded">Volver</a>
                            </div>
                        </div>        
                    </div>

                    <div v-else class="space-v">

                        <div class="is-scrollable">
                            <b-field grouped v-for="(item, index) in nro_divider" :key="index">
                                <b-field :label="`División Nro. ${index+1}`">
                                    <b-input placeholder="Inicio"
                                        size="is-small"
                                        icon="angle-double-right"
                                        icon-pack="fas"
                                        v-model="item[0]"
                                        @keyup.native="validateInputNumber(index, 0)">
                                    </b-input>
                                </b-field>

                                <b-field label="-">
                                    <b-input placeholder="Fin"
                                        size="is-small"
                                        icon="angle-double-left"
                                        icon-pack="fas"
                                        v-model="item[1]"
                                        @keyup.native="validateInputNumber(index, 1)">
                                    </b-input>
                                </b-field>
                            </b-field>
                        </div>

                        <div class="has-text-centered space-v-min">
                            <a @click="clearDivider()" class="button is-small is-vcentered is-primary is-outlined is-rounded">Limpiar</a>
                            <a @click="addDivider()" class="button is-small is-vcentered is-primary is-outlined is-rounded">Agregar</a>
                        </div>  

                        <div class="field center space-v-min">
                            <b-checkbox v-model="is_join">Unir todas las paginas</b-checkbox>
                        </div>

                        <div class="has-text-centered space-v-min">
                            <a @click="go()" class="button is-vcentered is-medium is-success is-outlined is-rounded">Dividir por rango</a>
                        </div>  

                        <div class="has-text-centered space-v">
                            <a @click="backRead()" class="button is-vcentered is-small is-warning is-rounded">Volver</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
</div>
</template>

<script>
import pdf from 'vue-pdf';
import axios from '@/config/axios.js';
const pathview = process.env.VUE_APP_API_URL + 'viewpdf';
import _folders from './folders.js';
const company = _folders.company
const years = _folders.years
const months = _folders.months
const banks = _folders.banks
//const {company, years, months, banks} = require('./folders.js');

export default {
  data() {
    return {
      show_read: true,
      pdf_main: '',

      //Datos del usario
      datauser: '',

      //Config PDF
      show: true,
      src: pathview,
      loadedRatio: 0,
      page: 1,
      numPages: 0,

      //Config Editor
      show_edit: 'divide',
      nro_divider: [['', '']],
      nro_divider_convert: '',
      is_join: false,

      //Config Loading
      isLoading: false,
      isFullPage: true,

      //Config Read
      activeTab: 0,
      isactivetab: [false, true, true, true, true, true],

      //Datos de los archivos guardados
      data: '',

      //Datos molde
      datamodel: [],
      datatemp: [],
      datatempfilter: [],

      //Dato del modo automatico
      is_auto: false,

      //Input filter
      filtersearch: '',

      //Datos de carpetas
      company,
      years,
      months,
      banks,
      names: [
        {
          name: 'Cheque',
          abv: 'CHEQUE',
        },
        {
          name: 'Factura',
          abv: 'FACTURA',
        },
      ]

    };
  },
  methods: {
    /*
    READ ----------
    */

    //Avanzar pestaña
    next(dato) {
      if(dato.split(':')[0] == 'type'){
        if(dato.split(':')[1] == 'Cheque'){
          this.activeTab++;
          this.datamodel.push(dato);
        }else{
          this.activeTab++;
          this.activeTab++;
          this.datamodel.push(dato);
          this.datamodel.push('bank:Banco 0');
        }
      }else{
        this.activeTab++;
        this.datamodel.push(dato);
      }
      
      //this.search()
    },

    //Retroceder pestaña
    back() {
      this.activeTab--;
    },

    //Finalizar busqueda
    finalize(dato) {
      this.datatemp =[]
      this.activeTab++;
      this.datamodel.push(dato);
      this.search();
    },

    //Buscar en Onedrive
    async search() {
      this.isLoading = true;
      this.$toast.open({
        message: '[INFO] Buscando en OneDrive',
        type: 'is-info',
      });
      let modelito = {
        company: this.datamodel[0].split(':')[1],
        type: this.datamodel[1].split(':')[1],
        bank: this.datamodel[2].split(':')[1],
        year: this.datamodel[3].split(':')[1],
        month: this.datamodel[4].split(':')[1],
      };
      /*await this.getFiles(
        modelito.company,
        modelito.month,
        modelito.type,
        modelito.year,
        modelito.bank
      );*/
      await this.getFiles(modelito)
    },

    /**
     * Busqueda de archivos
     * @param company Nombre de la empresa
     * @param month Mes
     * @param type tipo (cheque o factura)
     * @param year Año
     */
    async getFiles(body) {

      try {
        let res = await axios.post('/onedrive/all', body)
        console.log(res)
        if (res.data.res) {
          this.datatemp = res.data.pdf;
          console.log('data -->')
          console.log(this.datatemp)
          this.isLoading = false;
          this.$forceUpdate();
        }
      } catch (error) {
        this.isLoading = false;
        this.$toast.open({
          message: '[ERROR] Busqueda en OneDrive',
          type: 'is-danger',
        });
        console.log(`Error al consultar datos --> ${err}`);
      }
    },

    /**
     * Descargar archivo seleccionado
     * @param id id del archivo de Onedrive
     * @param name nombre del archivo
     * @param year año
     * @param number numero de la cuenta por año
     */
    async downloadFileForId(id, name) {
      this.isLoading = true;
      this.$toast.open({
        message: '[INFO] Descargando archivo de OneDrive',
        type: 'is-info',
      });
      await axios
        .get(`/onedrive/download/${id}/${name}`)
        .then(res => {
          if (res.data.res) {
            this.pdfEdit(name+'.pdf');
            this.isLoading = false;
            this.$forceUpdate();
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.$toast.open({
            message: '[ERROR] Al descargar archivo en OneDrive',
            type: 'is-danger',
          });
          console.log(`Error al consultar datos --> ${err}`);
        });
    },

    //Retrocede la pestaña e inhabilita el resto
    viewActiveTab() {
      this.isactivetab[this.activeTab] = false;
      for (let i = this.activeTab + 1; i < this.isactivetab.length; i++) {
        this.isactivetab[i] = true;
      }
      this.datamodel.splice(this.activeTab, this.datamodel.length);
      this.$forceUpdate();
      console.log(this.datamodel);
    },

    //Selecciona el archivo para editar
    pdfEdit(name) {
      //let filename = path.split('/')[1];
      this.pdf_main = name;
      this.src += `/${name}`;
      this.show_read = false;
      this.$forceUpdate();
    },

    backRead() {
      this.src = pathview;
      this.pdf_main = '';
      this.loadedRatio = 0;
      this.page = 1;
      this.numPages = 0;
      this.show_read = true;
      this.nro_divider_convert = '';
      this.nro_divider = [['', '']];
      this.is_join = false;
      this.$forceUpdate();
    },

    //Buscar por filtro
    async searchForFilter() {
      this.isLoading = true;
      this.$toast.open({
        message: '[INFO] Buscando archivos en OneDrive',
        type: 'is-info',
      });

      await axios
        .get(`/onedrive/files/${this.filtersearch}`)
        .then(res => {
          if (res.data.res) {
            if (res.data.pdf.length > 0) {
              this.datatempfilter = res.data.pdf;
              this.$forceUpdate();
              this.isLoading = false;
            } else {
              this.$toast.open({
                message:
                  '[WARN] No se encontro archivos que coincidan en OneDrive',
                type: 'is-warning',
              });
              this.datatempfilter = [];
              this.$forceUpdate();
              this.isLoading = false;
            }
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.$toast.open({
            message: '[ERROR] En la busqueda de archivos en OneDrive',
            type: 'is-danger',
          });
          console.log(`Error al consultar datos --> ${err}`);
          this.datatempfilter = [];
        });
    },

    /*
    EDIT --------
    */

    //Llama a la api para extraer todas las paginas de un archivo
    async goExtracAll() {
      await axios
        .get(`/extall/${this.pdf_main}`)
        .then(res => {
          if (res.data.res) {
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.$toast.open({
            message: '[ERROR] Al procesar archivo en OneDrive',
            type: 'is-danger',
          });
          console.log(`Error al consultar datos --> ${err}`);
        });
    },

    //Una vez que extrae todas las paginas del archivo, 
    //llama de nuevo a la api para descargarlo
    async downloadExtracAll() {
      this.$toast.open({
        message: '[INFO] Descargando ZIP',
        type: 'is-info',
      });
      await axios({
        url: `${process.env.VUE_APP_API_URL}zip/${this.numPages}/true`,
        method: 'GET',
        responseType: 'blob',
      })
        .then(async response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'pdf.zip');
          document.body.appendChild(link);
          this.isLoading = false;
          link.click();
        })
        .catch(async err => {
          this.$toast.open({
            message: '[ERROR] ERROR AL DESCARGAR',
            type: 'is-danger',
          });
          console.log(err);
          await this.deleteTemp();
        });
    },

    //Proceso para iniciar el extraer todo
    async extractAll() {
      this.isLoading = true;
      this.$toast.open({
        message: '[INFO] Procesando archivo de OneDrive',
        type: 'is-info',
      });
      await this.goExtracAll();
      await this.downloadExtracAll();
      await this.deleteTemp();
      await this.$toast.open({
        message: '[OK] Proceso exitoso',
        type: 'is-success',
      });
    },

    //Alerta un error si no visualiza el PDF
    error: function(err) {
      console.log(err);
    },

    //Agrega otro rango de paginas
    addDivider() {
      this.nro_divider.push(['', '']);
      console.log(this.nro_divider);
    },

    //Limpia los rangos de paginas
    clearDivider() {
      this.nro_divider = [['', '']];
    },

    //Evento para empezar el proceso
    go() {
      if (this.validateInputEmpty()) {
        if (this.validateInputMaxMin()) {
          if (this.validateInputMaxMinPages()) {
            this.convertNroDivider();
            this.goEdit(this.pdf_main, this.nro_divider_convert, this.is_join);
            this.$toast.open({
              message: '[INFO] Procesando PDF, por favor espere...',
              type: 'is-info',
            });
            this.isLoading = true;
          } else {
            this.$dialog.alert({
              title: 'Error',
              message:
                'Los valores que introdujo son mayores o menores al numero de paginas del PDF.',
              type: 'is-danger',
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fas',
            });
          }
        } else {
          this.$dialog.alert({
            title: 'Error',
            message: 'El valor de inicio debe ser mayor o igual al valor fin.',
            type: 'is-danger',
            hasIcon: true,
            icon: 'times-circle',
            iconPack: 'fas',
          });
        }
      } else {
        this.$dialog.alert({
          title: 'Error',
          message: 'Debe llener todos los campos de rangos.',
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fas',
        });
      }
    },

    //Llama a otros eventos hijos dividos en el proceso principal padre
    async goEdit(file, data, join) {
      if (this.show_edit == 'divide') {
        let size = await this.goPDF(file, data, join);
        await this.downloadPDF(size, join);
        await this.deleteTemp();
      }
    },

    //Toma el array de rangos y lo pasa a un string separados por comas y barra (1,5|6,9)
    convertNroDivider() {
      let dato = this.nro_divider;
      let aux = '';
      for (let i in dato) {
        aux += `${dato[i][0]},${dato[i][1]}|`;
      }
      this.nro_divider_convert = aux.slice(0, -1);
      console.log(this.nro_divider_convert);
    },

    //Evento principal para iniciar el proceso Hummus
    async goPDF(file, split, join) {
      let size = 0;

      await axios
        .get(`/gopdf/${file}/${split}/${join}`)
        .then(async res => {
          if (res.data.res) {
            console.log('OK Init Hummus');
            this.$toast.open({
              message: '[INFO] Paso Nro. 1',
              type: 'is-info',
            });
            size = res.data.size;
          } else {
            await this.deleteTemp();
            this.$toast.open({
              message: '[ERROR] Paso Nro. 1: ERROR',
              type: 'is-danger',
            });
          }
        })
        .catch(err => {
          console.log(err);
        });

      return size;
    },

    //Descarga los archivos separados o unidos
    async downloadPDF(tam, isjoin) {
      console.log(isjoin);
      if (isjoin) {
        await axios({
          url: `${process.env.VUE_APP_API_URL}downloadtemp/outpdf.pdf`,
          method: 'GET',
          responseType: 'blob',
        })
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `outpdf.pdf`);
            document.body.appendChild(link);
            link.click();
          })
          .catch(async err => {
            this.$toast.open({
              message: '[ERROR] ERROR AL DESCARGAR',
              type: 'is-danger',
            });
            console.log(err);
            await this.deleteTemp();
          });
      } else {
        await axios({
          url: `${process.env.VUE_APP_API_URL}zip/${tam}/false`,
          method: 'GET',
          responseType: 'blob',
        })
          .then(async response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'pdf.zip');
            document.body.appendChild(link);
            link.click();

            this.$toast.open({
              message: '[INFO] Paso Nro. 2: OK',
              type: 'is-info',
            });
          })
          .catch(async err => {
            this.$toast.open({
              message: '[ERROR] ERROR AL DESCARGAR',
              type: 'is-danger',
            });
            console.log(err);
            await this.deleteTemp();
          });
      }
    },

    //Elimina la carpeta temp de la ruta files/
    async deleteTemp() {
      await axios
        .get(`/deletetemp`)
        .then(async res => {
          if (res.data.res) {
            console.log('OK');
            this.isLoading = false;
            this.$toast.open({
              message: '[OK] Proceso Finalizado',
              type: 'is-success',
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //Valida la entrada de texto en el input, siempre tiene que ser un numero
    validateInputNumber(i, j) {
      let exp = /^[0-9]{1,9}$/;
      if (!exp.test(this.nro_divider[i][j])) {
        this.nro_divider[i][j] = '';
      }
      this.$forceUpdate();
    },

    validateInputMaxMin() {
      let array = this.nro_divider;
      let c = 0;
      for (let i in array) {
        if (
          parseInt(array[i][0]) > parseInt(array[i][1]) ||
          parseInt(array[i][1]) < parseInt(array[i][0])
        ) {
          c++;
        }
      }
      return c > 0 ? false : true;
    },

    validateInputEmpty() {
      let array = this.nro_divider;
      let c = 0;
      for (let i in array) {
        if (array[i][0] == '') {
          c++;
        }
        if (array[i][1] == '') {
          c++;
        }
      }
      return c > 0 ? false : true;
    },

    validateInputMaxMinPages() {
      let array = this.nro_divider;
      let max_pages = this.numPages;
      let c = 0;
      for (let i in array) {
        if (parseInt(array[i][0]) > max_pages || parseInt(array[i][0]) < 1) {
          c++;
        }
        if (parseInt(array[i][1]) > max_pages || parseInt(array[i][1]) < 1) {
          c++;
        }
      }
      return c > 0 ? false : true;
    },
  },
  components: {
    pdf,
  },
  created() {
    setTimeout(() => {
      let userId = this.$cookie.get('userId');
      let isAuthUser = userId != undefined ? true : false;
      console.log(userId);
      console.log(isAuthUser);
      if (!isAuthUser) location.reload();
    }, 100);
  },
};
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.big-max {
  width: 5em;
  height: 3em;
}

.tabitem {
  margin: 0px 350px 0px 350px;
}

.btnmax {
  width: 180px;
}
.btnmaxx {
  width: 200px;
}

.container {
  height: 100%;
  margin: 0;
  padding: 0;
}

.part-one {
  height: 80vh;
  /*border: solid 1px black;*/
  margin: 0px 15px 0px 15px;
}

.part-two {
  height: 38vh;
  /*border: solid 1px black;*/
  margin: 0px 15px 0px 15px;
}

.maxpdf {
  height: 10px;
}

.space {
  margin-right: 2em;
}

.space-v {
  margin-top: 2.5em;
}
.space-v-min {
  margin-top: 1.2em;
}

.max-tam {
  max-height: 200px;
}

.is-scrollable {
  overflow-y: scroll;
  height: auto;
  max-height: 15em;
}

.input-filter {
  max-width: 20em;
}

.buttons:last-child {
    margin-bottom: 3rem;
}
</style>


