import {Input11} from '~/server/api/types.d';
export default defineApexHandler<Input11>(async (data) => {
  return { "data": { "data": 72, "result1": [ false ] } };
});
