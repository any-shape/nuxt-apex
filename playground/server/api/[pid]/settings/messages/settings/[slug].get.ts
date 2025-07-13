import {Input14} from '~/server/api/types.d';
import { randomData2 } from './../../../../utils/utils1';

export default defineApexHandler<Input14>(async (data) => {
  return randomData2(data);
});
