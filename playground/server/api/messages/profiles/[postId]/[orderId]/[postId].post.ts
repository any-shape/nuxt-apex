import {Input20} from '~/server/api/types.d';
// as: getPosts
export default defineApexHandler<Input20>(async (data) => {
  return { "data": { "data": true } };
});
