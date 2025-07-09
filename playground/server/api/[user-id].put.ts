import {Input9} from '~/server/api/types.d';
import { randomData3 } from './utils/utils2';

export default defineApexHandler<Input9>(async (data) => {
  return randomData3(data);
});
