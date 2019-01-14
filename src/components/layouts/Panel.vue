<template>
<div id="dash">

  <nav class="navbar">
      <div class="navbar-brand">
         <a class="navbar-item" @click="go('login')">
            <img src="img/container.jpg" width="50" height="28">
            <h1 class="title is-5">PDF-Viewer</h1>
         </a>
         <div class="navbar-burger burger" data-target="nav-phone" @click="burger()">
            <span></span>
            <span></span>
            <span></span>
         </div>
      </div>

      <div id="nav-phone" class="navbar-menu">
         <div class="navbar-end">
            <b-dropdown  position="is-bottom-left">
               <a class="navbar-item is-info" slot="trigger">
                     <span>{{userdata.fullname}}</span>
                     <b-icon icon="caret-down" pack="fas"></b-icon>
               </a>
               <b-dropdown-item value="logout" @click="logout()">
                     <b-icon icon="sign-out-alt" pack="fas"></b-icon>
                     Salir
               </b-dropdown-item>
            </b-dropdown>
         </div>
      </div>
  </nav>

  <div class="center">

    <div class="is-main-content">

      <router-view></router-view>

    </div>

  </div>

  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        &copy;2018 — <strong>PDF-Viewer</strong>
      </p>
    </div>
  </footer>

  <b-loading :is-full-page="isFullPage" :active.sync="isLoading" :can-cancel="false"></b-loading>
</div>

</template>

<script>

import axios from "@/config/axios.js";

export default {
  data() {

    return {
      drawer: true,

      preLoading: 0,
      isLoading: false,
      isFullPage: true,

      userdata: '',

      right: null,
      menus: [{ title: 'Cerrar Sesión' }]

    };
  },
  methods: {
    logout() {
      this.$cookie.delete('userId')
      this.go('login');
    },

    go(route) {
      this.$router.push({ name: route });
    },

    //Metodo para abrir el menu en vista movil
    burger() {
      let burger = document.querySelector('.burger');
      let nav = document.querySelector('#' + burger.dataset.target);

      burger.classList.toggle('is-active');
      nav.classList.toggle('is-active');
    },

    isNotLoading() {
      if (this.preLoading == 2) {
        this.isLoading = false;
      }
    },

    async getUserLogin() {
      await axios
        .get(`/users/${this.$cookie.get('userId')}`)
        .then(res => {
          if (res.data.res) {
            this.userdata = res.data.user;
          }
        })
        .catch(err => {
          console.log(err)
        });
    }
  },

  created() {
    this.getUserLogin();
  }
};
</script>


<style scoped>
.navbar {
  height: 1em;
  -webkit-box-shadow: 0px 7px 36px -13px #555151;
  -moz-box-shadow: 0px 7px 36px -13px #555151;
  box-shadow: 0px 7px 36px -13px #555151;
  margin-bottom: 10px;

  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 4;
}

.menu-label {
  color: white;
}

.menu-list li a {
  color: white;
}

.menu-list li a:hover {
  color: black;
}

.is-main-content {
  margin: 80px 10px 10px 10px;
  z-index: 1;
}

.container {
  width: 100vw;

  max-width: 100vw;
  padding: 0px 10px 0px 10px;
}

.footer {
  background-color: white;
  position: fixed;
  bottom: 0px;
  right: 0px;
  left: 0px;
  padding: 3px;
  z-index: 4;
}

.photo {
  width: 60%;
  border-radius: 50px;
  margin: auto;
  display: block;
}

.container-photo {
  margin: auto;
  display: block;
  margin-bottom: 25px;
  text-align: center;
}

.fullname {
  color: white;
}

hr {
  background-color: black;
  opacity: 0.3;
}

.border {
  border: solid 1px rgba(79, 147, 237);
  border-radius: 50px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

