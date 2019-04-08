<template>
  <div>
    <router-view></router-view>
    <div class="box">
      <h1>Manage Your Books Easily and Efficiently</h1>
      <h1>Sign Up Today!</h1>
    </div>
    <div class="container"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
h1 {
  color: black;
  text-align: center;
}

.box {
  background-color: white;
}

.container {
  height: 400px;
  background-image: url(..//pics//library_pataskala_026.jpg);
}
</style>

