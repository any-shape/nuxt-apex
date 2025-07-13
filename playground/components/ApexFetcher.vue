<template>
  <div class="apex-fetcher">
    <span>{{ composableName }}</span>
    <span>Static: {{ result.status }}; Response: {{ JSON.stringify(result.data.value) }} == {{ JSON.stringify(response) }}</span>
    <!-- <span>Dynamic: {{ result.status }}; Response: {{ result.data == response ? '✅' : '❌' }}</span> -->
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{ composable: Function, composableName: string, payload: any, response: any }>()
  const result = await props.composable(props.payload)
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
