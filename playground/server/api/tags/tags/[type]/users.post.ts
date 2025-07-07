import {Input16} from '~/server/api/types'
export default defineApexHandler<Input16>(async (data) => {
  return { "data": true, "result1": false, "items2": { "data": [ [ "dflx14", "v3pp4p" ] ], "result1": false } }
})
