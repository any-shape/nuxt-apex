import {Input13} from '~/server/api/types.d';
export default defineApexHandler<Input13>(async (data) => {
  return { "data": [ true, true, { "data": true } ], "result1": 20 };
});
