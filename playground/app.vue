<template>
  <div>
    <!-- @vue-ignore -->
    <apex-fetcher v-for="([c, info], i) in Object.entries(fakeData)" :key="i" :composable="info.fn" :composable-name="c" :payload="info.payload" :response="info.response"/>
  </div>
</template>

<script setup lang="ts">

  const fakeData = {
    useTFetchPidSettingsMessagesSettingsGetBySlug: {
      fn: useTFetchPidSettingsMessagesSettingsGetBySlug,
      payload: {
        "pid": "19f5tn",
        "slug": "rar1a6",
        "viewId": "491y38",
        "createdAt": "97ct9w",
        "email": "mtcpe5",
        "productId": "04dos3",
        "nextId": "d8k879",
        "age": 56
      },
      response: {
        "vid": "vid",
        "data": [
          35
        ],
        "result1": false,
        "items2": {
          "data": false
        }
      }
    }
  }
</script>
