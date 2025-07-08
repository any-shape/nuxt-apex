import {Input19} from '~/server/api/types.d';
import { randomData2 } from './../../../../utils/utils1';

export default defineApexHandler<Input19>(async (data) => {
  return randomData2(data);
});
