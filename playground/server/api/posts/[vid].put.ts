import {Input2} from '~/server/api/types'
export default defineApexHandler<Input2>(async (data) => {
  return { "data": { "data": { "data": [ false ], "result1": true } }, "result1": { "data": 82 } }
})
