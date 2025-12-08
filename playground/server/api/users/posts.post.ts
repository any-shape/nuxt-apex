import {Input21} from '~/server/api/types.d';
import { randomData4 } from './../utils/utils2';

export default defineApexHandler(async (data) => {
  return randomData4(data);
});
