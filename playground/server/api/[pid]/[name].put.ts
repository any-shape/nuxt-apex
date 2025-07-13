import {Input3} from '~/server/api/types.d';
export default defineApexHandler<Input3>(async (data) => {
  return { "data": [ [ 3 ] ] };
});
