<template>
  <q-page class="flex flex-center primarybg">
    <div class="column">
      <div class="row items-center">
        <div class="vdlogo">
              <img src="../assets/vdlogo.png" alt="vidash logo">
        </div>
        <div class="headertext">
              Welcome to <br><span>Vidash Live</span>
        </div>
      </div>



        <q-input v-model="name" label="Enter your Nick name" color="white" dark
        error-message="Please use maximum 14 characters"
        :error="!isValid" hint="Max 14 characters"
        class="primarytextcolor q-py-lg myfont-r"/>

      <div class="flex-res">
           <div class="nsoftcard">
          <div class="createcard text-center">
                <!-- <q-input v-model="cname" label="Enter Nick name" dark  class="primarytextcolor"/> -->
                <q-btn color="white" class="ccardbtn myfont-m"  @click="create" flat
                >Create Meeting</q-btn>
          </div>
    </div>
    <div class="res-pd"></div>
     <div class="nsoftcard">
           <div class="joincard text-center">
                <!-- <q-input v-model="jname" label="Enter Nick name" dark class="primarytextcolor"/> -->
                <q-input class="inputid q-py-md myfont-r" filled v-model="jid" dark dense
                placeholder="Enter Meeting ID to join"/>
                <q-btn flat color="white" @click="join" class="jcardbtn myfont-m">Join Meeting</q-btn>
          </div>
     </div>
      </div>


</div>
      <!--  -->
  </q-page>

</template>

<script>

import MyDetail from "../mydetail";

export default {
  name: 'Main',

  data () {
    return {
        rid:null,
        name:'',
        jid:null
    }
  },
  computed: {
     isValid () {
      return this.name.length <= 13
    }
  },
  sockets: {
    room_created: function (tempid) {
      this.rid =  tempid
    },


  },
  methods : {
        create() {
           if(this.name !== '' && this.isValid){
              this.$socket.emit('create-room',this.name);
              MyDetail.name = this.name;
              this.$q.loading.show()
              setTimeout(() => {
                  if(this.rid != null)
                  this.$router.push('/'+this.rid)

                  this.$q.loading.hide()
                },2000)
           }
           else if(!this.isValid){
             this.$q.notify({
                position: 'top',
                message:'Lengthy Name not allowed'
               })
           }
           else{
              this.$q.notify({
                position: 'top',
                message:'Name Field cant be Empty'
               })
           }
        },
        join() {
            if(this.jid !== null && this.name !== '' && this.isValid){
                //this.$socket.emit('send-username',this.name);
                  MyDetail.name = this.name;
                  this.$q.loading.show()
                  this.$router.push('/'+this.jid)
            }
             else if(!this.isValid){
             this.$q.notify({
                position: 'top',
                message:'Lengthy Name not allowed'
               })
           }
            else{
              this.$q.notify({
                position: 'top',
                message:'Fields cant be Empty'
              })
            }
        }
  },

  mounted() {
  }
}
</script>
<style lang="scss" scoped>
.vdlogo > img{
  width:110px;
}
.createcard{
  padding:10px;
  width:82vw;
    border-radius: 8px;
  background: #729BFF;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #8f94fb, #729BFF);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #8f94fb, #729BFF); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.joincard{
  padding:10px;
    width:82vw;
    border-radius: 8px;
    background: #b377d6;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #c497d2, #b377d6);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #c497d2, #b377d6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}


.headertext{
  font-family: 'Poppins Light';
  font-size: 1.4rem;
  color:#ffffffb3;
  line-height: 1.6;
  padding-left: 20px;
}
.headertext span{
  font-family: 'Poppins SemiBold';
  font-size: 2rem;
  color:#fff;
}
.ccardbtn{
     width:100%;
     height: 100%;
}
.jcardbtn{
     width:100%;
}
.q-field--dark .q-field__control:before {
    border-color: rgba(255, 255, 255, 0.3) !important;
}
@media only screen and (min-width: 900px) {
  .flex-res {
    display: flex;
    flex-direction: row;
  }
  .createcard, .joincard{
    width:400px;
    height: 130px;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .res-pd{
    width:30px;
  }
  .inputid{
    width:360px;
  }

}
@media only screen and (max-width: 899px) {
  .flex-res {
    display: flex;
    flex-direction: column;
  }
  .res-pd{
    width:0;
  }
}
@media only screen and (max-width: 399px) {
    .joincard, .createcard{
      width:85vw;
    }
    .vdlogo{

      display: none;
    }

  .headertext{
    padding-left: 0px;
  }
}
</style>
