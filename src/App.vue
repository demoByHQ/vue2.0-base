<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
  }

  function getScript (src) {
    window.localStorage.setItem('ACCESS_TOKEN', '')
    document.write('<' + 'script src="' + src + '"' + ' type="text/javascript"><' + '/script>')
  }

  getScript('https://map.qq.com/api/js?v=2.exp&key=B4WBZ-JHB3F-QOVJT-JMXWF-LRVUS-TQFEB&libraries=drawing,geometry,autocomplete,convertor')

</script>

<style>
  /*@import '~vux/src/styles/reset.less';*/
  @import 'assets/css/common.css';

  body {
    display: block;
    margin: 0px;
    background-color: #F1F6F9;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
