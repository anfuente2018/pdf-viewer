<template>
<div>
  <div class="columns" v-if="isRoot == false">

    <div class="column is-one-third master">

      <section class="section">

        <p class="title is-3 has-text-centered">¡Bienvenido!</p>

        <b-field>
          <b-input placeholder="Username"
                type="text"
                icon-pack="fas"
                icon="user"
                maxlength="12"
                min="5"
                rounded
                v-model="userLogin.username"
                @keyup.enter.native="go('panel')">
            </b-input>
        </b-field>

        <b-field>
          <b-input placeholder="Contraseña"
                type="password"
                icon-pack="fas"
                icon="key"
                password-reveal
                rounded
                v-model="userLogin.password"
                @keyup.enter.native="go('panel')">
            </b-input>
        </b-field>

        <div class="has-text-centered">
          <a @click="go('panel')" class="button btn is-vcentered is-primary is-outlined is-rounded">Iniciar Sesión</a>
          
        </div>
      </section>
    </div>

    <!--id="particles-js"-->
    <div  class="interactive-bg column master submaster">
      <img class="login-logo" src="img/container_full.jpg">
    </div>
  </div>

  <div class="columns" v-else>

    <div class="column is-5">
      <section class="section secusers">

        <p class="title is-3 has-text-centered">#Superusuario</p>
        <p class="title is-6 has-text-centered">Crear Usuarios</p>

        <b-input placeholder="Nombre"
            type="text"
            icon-pack="fas"
            icon="user-plus"
            maxlength="20"
            min="3"
            rounded
            v-model="userModel.name">
        </b-input>

        <b-input placeholder="Apellido"
            type="text"
            icon-pack="fas"
            icon="address-card"
            maxlength="20"
            min="3"
            rounded
            v-model="userModel.lastname">
        </b-input>

        <b-input placeholder="Username"
            type="text"
            icon-pack="fas"
            icon="user"
            maxlength="12"
            min="5"
            rounded
            v-model="userModel.username">
        </b-input>

        <b-input placeholder="Contraseña"
            type="password"
            icon-pack="fas"
            icon="key"
            password-reveal
            rounded
            v-model="userModel.password">
        </b-input>


        <div class="has-text-centered">
          <a @click="createUser()" class="button btn is-vcentered is-primary is-rounded">Crear</a>
          
        </div>
      </section>
    </div>

    <div class="column is-7 secuserss">
      <b-table
        :data="isEmpty ? [] : users"
        :bordered="isBordered"
        :striped="isStriped"
        :narrowed="isNarrowed"
        :hoverable="isHoverable"
        :loading="isLoading"
        :focusable="isFocusable"
        :mobile-cards="hasMobileCards">

        <template slot-scope="props">

            <b-table-column field="name" label="Nombre" centered>
                {{ props.row.name }}
            </b-table-column>

            <b-table-column field="lastname" label="Apellido" centered>
                {{ props.row.lastname }}
            </b-table-column>

            <b-table-column field="username" label="Username" centered>
                {{ props.row.username }}
            </b-table-column>

            <b-table-column field="date" label="Date" centered>
                <span class="tag is-success">
                    {{ new Date(props.row.date).toLocaleDateString() }}
                </span>
            </b-table-column>

            <b-table-column field="event" label="Accion" width="20" centered>
                <a class="button is-small is-danger is-outlined" @click="deleteUser(props.row._id)">
                    <span class="icon is-small">
                    <i class="fas fa-times-circle"></i>
                    </span>
                </a>
            </b-table-column>

        </template>

        <template slot="empty">
            <section class="section">
                <div class="content has-text-grey has-text-centered">
                    <p>
                        <b-icon
                            icon="emoticon-sad"
                            size="is-large">
                        </b-icon>
                    </p>
                    <p>Aun no hay usarios.</p>
                </div>
            </section>
        </template>
      </b-table>
    </div>

  </div>

</div>
  
</template>

<script>
import axios from "@/config/axios.js";

export default {
  name: "login",
  data() {
    return {
      isRoot: false,

      users: [],
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: false,
      isHoverable: false,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: true,

      userLogin: {
        username: "",
        password: ""
      },

      userModel: {
        name: "",
        lastname: "",
        username: "",
        password: "",
        date: new Date()
      }
    };
  },
  methods: {
    async go(route) {
      if (
        this.userLogin.username == "root" &&
        this.userLogin.password == "root"
      ) {
        this.isRoot = true;
        await this.getUserAll();
      } else {
        await this.getUserLogin(route);
      }
    },

    async createUser() {
      await axios
        .post("/user", this.userModel)
        .then(res => {
          if (res.data.res) {
            this.$toast.open({
              message: "[OK] Usuario creado",
              type: "is-success"
            });
            this.clearUserModel();
            this.getUserAll();
            this.$forceUpdate();
          }
        })
        .catch(err => {
          this.$toast.open({
            message: "[ERROR] No se pudo crear el usuario",
            type: "is-danger"
          });
        });
    },

    clearUserModel() {
      this.userModel = {
        name: "",
        lastname: "",
        username: "",
        password: "",
        date: new Date()
      };
    },

    async getUserAll() {
      await axios
        .get("/user/all")
        .then(res => {
          if (res.data.res) {
            this.users = res.data.user;
            this.$forceUpdate();
          }
        })
        .catch(err => {
          this.$toast.open({
            message: "[ERROR] No hay conexion con la base de datos",
            type: "is-danger"
          });
        });
    },

    async deleteUser(id) {
      await axios
        .delete(`/user/${id}`)
        .then(res => {
          if (res.data.res) {
            this.$toast.open({
              message: "[OK] Usuario eliminado",
              type: "is-success"
            });
            this.getUserAll();
            this.$forceUpdate();
          }
        })
        .catch(err => {
          this.$toast.open({
            message: "[ERROR] No se pudo eliminar el usuario",
            type: "is-danger"
          });
        });
    },

    async getUserLogin(route) {
      await axios
        .get(`/user/${this.userLogin.username}/${this.userLogin.password}`)
        .then(res => {
          if (res.data.res) {
            let datauser = res.data.user;
            if (datauser.username == this.userLogin.username) {
              this.$cookie.set('userId', datauser._id, { expires: '1D' })
              this.$router.push({ name: route });
            }else{
              throw new Error("Error");
            }
          }
        })
        .catch(err => {
          this.$toast.open({
            message: "[ERROR] No existe el usuario",
            type: "is-danger"
          });
          console.log(err)
        });
    }
  }
};
</script>

<style scoped>
.master {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e9f7fa;
}

@keyframes animar {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1.1);
  }
}

.login-logo {
  width: 100%;
}

.interactive-bg {
  height: 100vh;
  background-color: #ffffff;
  /*background-color: #62929a;*/
  -webkit-box-shadow: inset 24px 4px 64px -24px rgba(71, 71, 71, 1);
  -moz-box-shadow: inset 24px 4px 64px -24px rgba(71, 71, 71, 1);
  box-shadow: inset 24px 4px 64px -24px rgba(71, 71, 71, 1);
  padding: 0px;
}
@media (max-width: 769px) {
  .interactive-bg {
    display: none;
  }
}

.btn {
  margin-top: 20px;
  margin-bottom: 20px;
  min-width: 150px;
}

.secusers {
  margin: 5em;
}
.secuserss {
  padding: 5em;
}
</style>




