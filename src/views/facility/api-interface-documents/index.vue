<template>
  <div class="h-full">
    <iframe class="wh-full" :src="src"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const src = ref('http://118.25.14.80:8849/doc.html#/home');
window.$message?.warning('接口文档加载中需要花费多些时间，请稍后……');
</script>

<style scoped></style>
