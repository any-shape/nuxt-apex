import {Input12} from '~/server/api/types.d';
import { randomData3 } from './../../../../utils/utils2';

export default defineApexHandler<Input12>(async (data) => {
  return randomData3(data);
});
