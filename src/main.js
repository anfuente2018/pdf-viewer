import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCookie from 'vue-cookie'
import logger from 'vuejs-logger'

//Buefy
import Buefy from 'buefy'

//CSS Buefy
import 'buefy/dist/buefy.css'

//Config

Vue.use(VueCookie)
Vue.use(Buefy, {
  defaultDayNames: ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'],
  defaultMonthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  defaultFirstDayOfWeek: 1,
  defaultDateFormatter: date => date.toLocaleDateString('es-ES')
})


const loggerOptions = {
  // optional : defaults to true if not specified
  isEnabled: true,
  // required ['debug', 'info', 'warn', 'error', 'fatal']
  logLevel: 'debug',
  // optional : defaults to false if not specified
  stringifyArguments: false,
  // optional : defaults to false if not specified
  showLogLevel: false,
  // optional : defaults to false if not specified
  showMethodName: false,
  // optional : defaults to '|' if not specified
  separator: '|',
  // optional : defaults to false if not specified
  showConsoleColors: false
}

Vue.use(logger, loggerOptions)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
