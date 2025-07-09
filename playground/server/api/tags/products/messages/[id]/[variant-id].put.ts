import {Input15} from '~/server/api/types.d';
export default defineApexHandler<Input15>(async (data) => {
  return { "data": [ 94, 73 ], "result1": true, "items2": [ [ 94 ] ] };
});
