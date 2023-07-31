<template>
  <q-page class="flex flex-center primarybg">
    <div class="column items-center fill-height">
       <div class="nsoftcircle">

       <div class="myvidcontainer" >
               <video ref="myvidref" autoplay></video>
        </div>
        <div class="name1">{{myname}}</div>
       </div>
      <div class="text-center nametext">
         <div class="name2">{{!showother ? 'Waiting for others to join':'Participants'}}</div></div>

         <div v-if="!showother">
                <q-input bottom-slots v-model="this.$route.params.rId" dark filled
                class="width-fit myfont-r" readonly color="primary">
                    <template v-slot:hint color="primary" >
                      Share this Meeting Id
                    </template>
                  <template v-slot:append>
                    <q-btn round dense flat icon="content_copy" color="white" @click="doCopy"/>
                  </template>
                </q-input>

         </div>
         <div :class="showother ? 'visible':'hidden'">
          <div id="videogrid" class="h-scroll">
          </div>
       </div>
     <q-footer class="primarybg">

          <div class="row cus-footer justify-evenly">
            <q-btn :icon="unmute ? 'mic' : 'mic_off'" v-on:click="toggleMute"
             flat  class="nsoftbtn" color="white"/>
            <q-btn :icon="play ? 'videocam' : 'videocam_off'" v-on:click="toggleVideo"
             flat color="white" class="nsoftbtn"/>
            <!-- <q-btn icon="email" label="Chat" stack flat color="white" /> -->

            <q-btn v-go-back=" '/' " v-on:click="closestream" class="nsoftbtn" flat
            icon="logout" color="negative" />
        </div>

      </q-footer>


    </div>
  </q-page>
</template>

<script>
//import VuePeerJS from 'vue-peerjs';
import Peer from 'peerjs';
import VueClipboard from 'vue-clipboard2';
import Vue from 'vue';
import { Notify } from 'quasar'

import MyDetail from "../mydetail";

Vue.use(VueClipboard)
// Vue.use(VuePeerJS, new Peer(undefined,{
//                   path: '/peerjs',
//                   host: 'vidash-web-server.herokuapp.com',
//                   //port: '443',
//            }));


require('md-gum-polyfill');


export default {

      data () {
        return {
          myvid: {},
          peers: {},
          peerconn: {},
          othervidcontainer: {
              wrap:{
                vname: {},
                othervid: {}
              }

          },
          unmute:true,
          play:true,
          ouid:'',
          myuid:'',
          oname:'',
          myname:MyDetail.name,
          showother:false,
        }
      },
       sockets: {

          ouser: function(un){
           this.oname = un
          },
          cuser: function(un){
           this.oname = un
          },

          user_connected: function (userId) {
              console.log('new user joined room:'+ userId)
              this.ouid = userId
              this.$socket.emit('my-name',this.$route.params.rId, this.myname)
              // send our stream to connected userid
              setTimeout(() => {
	  	        	this.sendOurVideo(userId, this.myvid.srcObject);
	  		  	}, 2000)

          },
          user_disconnected: function (userId) {
              console.log('User Disconnected: '+ userId)
              this.removeOtherVideo(userId, this.othervidcontainer.wrap.othervid.srcObject)
              this.showother = false;
          }
        },
      mounted() {

          // let peerScript = document.createElement('script')
          // peerScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js')
          // document.head.appendChild(peerScript)

          //peer config
           this.peerconn = new Peer(undefined,{
             // input peer config
           });
           this.peerconn.on('open',id => {
                  this.$socket.emit('join-room', this.$route.params.rId, id, this.myname)
                  this.myuid = id
                  console.log('where'+this.$route.params.rId)
          })

            // my video stream
            this.myvid = this.$refs.myvidref;
            this.myvid.muted = true;
            navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
            }).then(stream => {
              this.myvid.srcObject = stream;
              this.myvid.addEventListener('loadedmetadata', () => {
                this.myvid.play()
              })

                // //other user video streams
                this.othervidcontainer = document.getElementById('videogrid')
                // //Get other video
                this.othervidcontainer.wrap = document.createElement('div')
                 this.othervidcontainer.wrap.vname = document.createElement('div')
                this.othervidcontainer.wrap.othervid = document.createElement('video')
                console.log(this.peerconn)
                 setTimeout(() => {
                     this.peerconn.on('call',  call => {

                        call.answer(this.myvid.srcObject)
                        call.on('stream', userVideoStream => {

                          this.addVideoStream(this.othervidcontainer.wrap.othervid, userVideoStream)
                        })
                      })
                 }, 1000)

            });
      },
      methods: {
          doCopy: function () {
            this.$copyText(this.$route.params.rId).then(function (e) {
                Notify.create({
                 position: 'top',
                message:'Copied to Clipboard'
               })

              console.log(e)
            }, function (e) {
                Notify.create({
                 position: 'top',
                message:'Something went wrong'
               })

              console.log(e)
            })
          },
          addVideoStream(video, stream) {
            this.$q.loading.hide()
            video.srcObject = stream
              this.showother = true;
              console.log(this.showother)
            video.addEventListener('loadedmetadata', () => {
              video.play()

            })
            this.othervidcontainer.wrap.style.position = "relative";
            this.othervidcontainer.wrap.style.height = "30vh";
            this.othervidcontainer.wrap.style.width = "30vh";
            this.othervidcontainer.wrap.style.borderRadius = "50%";
            this.othervidcontainer.wrap.style.boxShadow = "5px 5px 10px #21222A, -5px -5px 10px #4a4f58";
            this.othervidcontainer.appendChild( this.othervidcontainer.wrap);


            this.othervidcontainer.wrap.vname.innerHTML = this.oname;
            this.othervidcontainer.wrap.appendChild( this.othervidcontainer.wrap.vname);

            var x = window.matchMedia("(max-height: 699px)")
            this.handleResponsiveness(x)

            x.addListener(this.handleResponsiveness) // Attach listener function on state changes

            this.othervidcontainer.wrap.othervid.style.cssText = "position:absolute;top: 0;left: 0;width: 30vh;padding: 8px;height: 30vh;object-fit: cover;border-radius:50%;clip-path: inset(0 0 22% 0);";
            this.othervidcontainer.wrap.append(video)
            this.$q.loading.hide()

          },
          handleResponsiveness(x) {
              if (x.matches) { // If media query matches
              this.othervidcontainer.wrap.vname.style.cssText = "position:absolute;top: 25vh;font-size: 0.8rem;font-family: 'Poppins Light';color:#fff;left: 50%;transform: translate(-50%,0%);";
              }
              else {
              this.othervidcontainer.wrap.vname.style.cssText = "position:absolute;top: 25vh;font-size: 1.1rem;font-family: 'Poppins Light';color:#fff;left: 50%;transform: translate(-50%,0%);";
              }
          },
          // getOtherUsername(){
          //     for (var i = 0; i < this.users.length; i++) {
          //         if (this.users[i] === this.myname) {
          //             continue;
          //         }
          //          console.log(this.users[i]);
          //         return this.users[i];
          //       }
          // },
          closestream() {
                    let tracks = this.$refs.myvidref.srcObject.getTracks();
                    tracks.forEach(track => {
                      track.stop();
                    });
                    this.$socket.emit('leave-room', this.$route.params.rId, this.myuid)
                    this.$socket.emit('disconnect-user', this.ouid)
                      if (this.peers[this.ouid]) {
                           // this.peers[this.ouid].close()
                      }
          },
          sendOurVideo(userId, stream) {
             //this.peers[userId] = this.peerconn.call(userId, stream)
            //check other stream
            // this.othervidcontainer.wrap.othervid = document.createElement('video')
            this.peerconn.call(userId, stream).on('stream', userVideoStream  => {
              this.addVideoStream(this.othervidcontainer.wrap.othervid, userVideoStream)

            })
          },
          removeOtherVideo(){
                      this.othervidcontainer.wrap.othervid.remove();
          },
          toggleMute() {
              const enabled = this.myvid.srcObject.getAudioTracks()[0].enabled;
              if (enabled) {
                this.myvid.srcObject.getAudioTracks()[0].enabled = false;
                this.unmute = false
              } else {

                this.myvid.srcObject.getAudioTracks()[0].enabled = true;
                this.unmute = true
              }
          },
          toggleVideo() {
              let enabled = this.myvid.srcObject.getVideoTracks()[0].enabled;
              if (enabled) {
                this.myvid.srcObject.getVideoTracks()[0].enabled = false;
                this.play = false
              } else {
                this.myvid.srcObject.getVideoTracks()[0].enabled = true;
                this.play = true
              }
          }
      }
}
</script>
<style lang="scss" scoped>

  .myvidcontainer, .myvidcontainer video {
    position:absolute;
    top: 0;
    left: 0;
    width: 30vh !important;
    padding: 8px;
    height: 30vh !important;
    object-fit: cover !important;
    border-radius:50%;
    clip-path: inset(0 0 22% 0);
  }

.nsoftcircle{
  position: relative;
  height: 30vh;
    width: auto;
  border-radius:50%;
  padding-left: 30vh; // Aspect Ratio 1:1
  box-shadow:  5px 5px 10px #21222A,
              -5px -5px 10px #4a4f58;
}

.nsoftbtn{
  padding:6px;
  width: 48px !important;
  height: 48px !important;
  border-radius: 50%;
  //background: #f0f3f4;
  box-shadow:  5px 5px 10px #21222A,
              -5px -5px 10px #4a4f58;
}
.nametext{
  font-family: 'Poppins Light';
  font-size: 1.2rem;
  line-height: 1.3;
  padding: 30px 10px;
  color:#ffffffb3;

}
.name1{
  position: absolute;
  top: 25vh;
    font-size: 1.1rem;
    font-family: 'Poppins Light';
    color:#fff;
    left: 50%;
    transform: translate(-50%,0%);
}
.name2{
      color:#ffffffb3;
       line-height: 2;
       padding-top: 15px;
       font-size: 1rem;

}
.fill-height{
  height: calc(100vh - 88px);
  width: 100%;
  justify-content: center;
  box-sizing: border-box;
}
.width-fit{
  width:80vw;
  text-align: center;
}
.hidden{
  visibility: hidden;
}
.visible{
  visibility: visible;
  position: relative;

}
.h-scroll{
  display: flex;
  flex-direction: row;

}
.cus-footer{
  padding:20px;
}
@media only screen and (max-height: 699px) {
    .nametext{
      font-size: 1rem;
    }
    .name1{
      font-size: 0.8rem;
    }

}
</style>
