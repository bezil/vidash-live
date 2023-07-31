import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
  debug: true,
  // connection: 'http://localhost:3030'
  connection: 'https://vidash-web-server.herokuapp.com/',
  // io('https://yourDomain:3000', { transport : ['websocket'] });
}))
