<template>
  <router-view />
</template>

<style>
html {
  filter: grayscale(100%);
}
@font-face {
  font-family: mFont;
  src: url('/ZCOOLKuaiLe-Regular.ttf');
}
.back-btn {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  z-index: 999;
}
#app {
  font-family: mFont, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
