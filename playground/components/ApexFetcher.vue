<template>
  <div class="apex-fetcher">
    <span>{{ composableName }}</span>
    <span>
      <span class="apex-fetcher-status">Status: {{ status }};</span>
      <span class="apex-fetcher-response">Response: {{ status === 'idle' ? '⏳' : (response ? '✅' : '❌') }}</span>
    </span>
    <span class="apex-fetcher-error" v-if="error">Error: {{ error }}</span>

    <div
      class="apex-fetcher-fetch"
      style="position: absolute; right: 10px; bottom: 5px; padding: 3px 7px; background: oklch(70.2% 0.183 293.541); border-radius: 4px; cursor: pointer;"
      v-if="fetcher"
      @click="fetcher()"
    >
      Fetch it
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { AsyncDataRequestStatus } from '#app'
  defineProps<{ composableName: string, response: boolean, status: Ref<AsyncDataRequestStatus> | string, error?: string, fetcher?: () => void }>()
</script>

<style lang="css">
  .apex-fetcher {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px 12px;
    margin-top: 10px;
    border-radius: 3px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    width: 450px;
  }
</style>
