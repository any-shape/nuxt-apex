<template>
  <div>
    <!-- <apex-fetcher
      composable-name="useTFetchCommentsIdProductsGetByUid"
      :status="r1.status"
      :response="cr(r1.data.value, testData.r1.response)"
    />

    <apex-fetcher
      composable-name="useTFetchMessagesProfilesPostIdOrderIdCreateByPostId"
      :status="r2.status"
      :response="cr(r2.data.value, testData.r2.response)"
    />

    <apex-fetcher
      composable-name="useTFetchPidNameGetById"
      :status="r3.status"
      :response="cr(r3.data.value, testData.r3.response)"
    />

    <apex-fetcher
      composable-name="useTFetchPidNamePostsRemoveByVariantId"
      :status="r4.status"
      :response="cr(r4.data.value, testData.r4.response)"
    />

    <apex-fetcher
      composable-name="useTFetchPidTagsCreateByCategoryId"
      :status="r5.status"
      :response="cr(r5.data.value, testData.r5.response)"
    />

    <apex-fetcher
      composable-name="useTFetchSettingsOrdersSlugOrderIdTagsUpdate"
      :status="r6.status"
      :response="cr(r6.data.value, testData.r6.response)"
    />

    <apex-fetcher
      composable-name="useTFetchPidNameTagsRemove"
      :status="r7.status"
      :response="cr(r7.data.value, testData.r7.response)"
    />

    <apex-fetcher
      composable-name="useTFetchUsersPostsCreate"
      :status="r8.status"
      :response="cr(r8.data.value, testData.r8.response)"
    /> -->

    <apex-fetcher
      composable-name="useTFetchUsersPostsCreate"
      :status="r9Valid.status"
      :response="cr(r9Valid.data.value, testData.r9Valid.response)"
    />

  </div>
</template>

<script setup lang="ts">
  const testData = {
    r1: {
      payload: {
        "email": "4oxfi3",
        "updatedAt": "5p3vry",
        "id": "y81zix",
        "uid": "0ksb5p"
      },
      response: { "data": [ [ [ false ], 17, [ { "data": { "data": { "data": true, "result1": 19 }, "result1": { "data": "pq3yix" }, "items2": { "data": { "data": false }, "result1": [ true, 33, true ] } }, "result1": "70ncov", "items2": [ "yobmy5", { "data": "8n9z5k", "result1": [ true, 60, "bclzfl" ] } ] } ] ], 17, "9qfym5" ], "result1": 47 }
    },
    r2: {
      payload: {
        "postId": "tn94sr",
        "ordeId": "jwo2qw",
        "status": "w098fl",
        "innerId": "lto15y",
        "prevId": "jzm5vi"
      },
      response: { "data": { "data": true } }
    },
    r3: {
      payload: {
        "price": 57,
        "status": "dtgzf1",
        "productId": "twjiud",
        "pid": "v423az",
        "name": "musruc",
        "id": "05zp99"
      },
      response: { "data": { "data": "qmy9m9", "result1": [ false, { "data": 46, "result1": { "data": { "data": {  } }, "result1": true, "items2": 15 } } ] }, "result1": 80, "items2": { "data": [ 80, { "data": { "data": false, "result1": { "data": { "data": { "data": false } } }, "items2": "s08neh" } }, { "data": { "data": { "data": { "data": 11 } }, "result1": { "data": "chtf38" }, "items2": [ 54, [ "qpeism", false ] ] }, "result1": { "data": { "data": { "data": 78 }, "result1": "3x6iaf", "items2": [ { "data": false }, { "data": false }, false ] } } } ] } }
    },
    r4: {
      payload: {
        "pid": "oyvx63",
        "name": "pf54ey",
        "variantId": "uwkt26",
        "viewId": "amjutc",
        "isActive": true,
        "age": 57,
        "nextId": "7zfi97",
        "outerId": "n7b8t5"
      },
      response: { "data": { "data": { "data": true }, "result1": [ true, [ [ { "data": 69, "result1": false, "items2": true }, 16 ] ] ] } }
    },
    r5: {
      payload: {
        "pid": "x3tpt5",
        "categoryId": "p60xkj",
        "outerId": "gusn08",
        "status": "m5lmjm",
        "email": "tkvane",
        "createdAt": "kwh114",
        "age": 13
      },
      response: { "data": { "data": [ { "data": [ { "data": { "data": "x94djw", "result1": { "data": false } }, "result1": { "data": { "data": false, "result1": "6qrsnd" } }, "items2": [ [ 69, false ], { "data": 99, "result1": 18, "items2": "c2pxps" }, { "data": "4jkvi9", "result1": 66, "items2": "6orlw1" } ] } ], "result1": { "data": true, "result1": [ { "data": [ true, false ], "result1": "r68vq9" }, { "data": false, "result1": [ "xlzafr" ], "items2": [ 52, false, 55 ] } ] } }, true, "vyxtal" ] } }
    },
    r6: {
      payload: {
        createdAt: "tso4hd",
        prevId: "c4dfnu",
        slug: "jwtgst",
        orderId: "gunkwd"
      },
      response: { "data": { "data": { "data": true, "result1": false }, "result1": [ { "data": [ { "data": [ [ "pglv91", true, true ], [ false ] ], "result1": true }, { "data": [ true, [ "1qee8c" ] ] } ] }, [ { "data": "y082n1" } ], "hdeudt" ] }, "result1": { "data": [ { "data": { "data": { "data": false, "result1": 36, "items2": [ false ] }, "result1": { "data": true } } } ] }, "items2": "swau3g" }
    },
    r7: {
      payload: {
        "productId": "dp0i00",
        "age": 65,
        "isActive": false,
        "pid": "asjm5m",
        "name": "zvyby8"
      },
      response: { "data": { "data": { "data": true, "result1": 44, "items2": false }, "result1": 96, "items2": { "data": { "data": [ { "data": "9r8mxk" } ], "result1": "cq0rp9" }, "result1": true, "items2": { "data": { "data": { "data": {  } } } } } }, "result1": { "data": 28, "result1": 85 } }
    },
    r8: {
      payload: {
        "status": "yat6mg",
        "createdAt": "m3d45i",
        "email": "ownapr",
        "age": 24,
        "nextId": "tzpyxh",
        "isActive": false,
        "count": 1,
        "outerId": "b78z0a",
        "categoryId": "jwz9jg"
      },
      response: { "categoryId": 'jwz9jg', "data": true }
    },
    r9Valid: {
      payload: {
        a: 'info',
        b: '15',
        d: 'test',
        t: true
      },
      response: { "data": "test" }
    },
    r9Invalid: {
      payload: {
        a: 10,
        b: 'test',
        d: 'test',
        t: new Date()
      },
      response: { "data": "test" }
    }
  }

  // const r1 = useTFetchCommentsIdProductsGetByUid(testData.r1.payload)
  // const r2 = useTFetchMessagesProfilesPostIdOrderIdCreateByPostId(testData.r2.payload)
  // const r3 = useTFetchPidNameGetById(testData.r3.payload)
  // const r4 = useTFetchPidNamePostsRemoveByVariantId(testData.r4.payload)
  // const r5 = useTFetchPidTagsCreateByCategoryId(testData.r5.payload)
  // const r6 = useTFetchSettingsOrdersSlugOrderIdTagsUpdate(testData.r6.payload)
  // const r7 = useTFetchPidNameTagsRemove(testData.r7.payload)
  // const r8 = useTFetchUsersPostsCreate(testData.r8.payload)

  const r9Valid = useTFetchValidationGet(testData.r9Valid.payload)

  // const r9Valid = useFetch('/api/validation', { method: 'get', query: testData.r9Valid.payload })


  const cr = (r1: any, r2: any) => JSON.stringify(r1) == JSON.stringify(r2)
</script>
