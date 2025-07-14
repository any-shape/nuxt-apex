import {Input16} from '~/server/api/types.d';
export default defineApexHandler<Input16>(async (data) => {
  return { "data": 9 };
});
