import {Input4} from '~/server/api/types'
export default defineApexHandler<Input4>(async (data) => {
  return { "data": { "data": true, "result1": true } }
})
