<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
.primarybg{
  background-color: #2C2D34 !important
}
.myfont-r{
  font-family: 'Poppins Regular';
}
.myfont-b{
  font-family: 'Poppins Bold';
}
.myfont-m{
  font-family: 'Poppins Medium';
}
.primarytextcolor{
  color: #C9BABA;
}
.nsoftcard{
  padding:6px;
  margin: 20px 0;
  border-radius: 16px;
  background: #34363d;
  box-shadow:  5px 5px 10px #21222A,
              -5px -5px 10px #4a4f58;
}
</style>
