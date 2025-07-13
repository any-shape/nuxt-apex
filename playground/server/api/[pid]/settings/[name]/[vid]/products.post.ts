import {Input19} from '~/server/api/types.d';
export default defineApexHandler<Input19>(async (data) => {
  return { "data": 87, "result1": true };
});
