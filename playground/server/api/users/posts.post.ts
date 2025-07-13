import {Input21} from '~/server/api/types.d';
import { randomData4 } from './../utils/utils2';

export default defineApexHandler<Input21>(async (data) => {
  return randomData4(data);
});
