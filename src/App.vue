<script setup lang="ts">
import chat from "./components/chat.vue";
import rtc from "./components/rtc.vue";
</script>

<template>
  <div class="container flex content-between wrapper">
    <rtc class="flex-1" />
    <chat />
  </div>
</template>
<style>
.wrapper {
  padding: 10px 10px;
  min-width: 100vw;
}
</style>