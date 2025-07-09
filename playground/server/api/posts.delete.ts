import {Input4} from '~/server/api/types.d';
import { randomData2 } from './utils/utils1';

export default defineApexHandler<Input4>(async (data) => {
  return randomData2(data);
});
