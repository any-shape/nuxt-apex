<template>
  <div class="apex-fetcher">
    <span>{{ composableName }}</span>
    <span>Status: {{ status }}; Response: {{ response ? '✅' : '❌' }}</span>
  </div>
</template>

<script setup lang="ts">
  import type { AsyncDataRequestStatus } from '#app'
  defineProps<{ composableName: string, response: boolean, status: Ref<AsyncDataRequestStatus> }>()
</script>

<style lang="css">
  .apex-fetcher {
    display: flex;
    flex-direction: column;
    padding: 10px 12px;
    margin-top: 10px;
    border-radius: 3px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    width: 450px;
  }
</style>
