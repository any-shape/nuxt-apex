import {Input10} from '~/server/api/types'
export default defineApexHandler<Input10>(async (data) => {
  return { "data": { "data": 13 }, "result1": 4, "items2": "so0wt5" }
})
