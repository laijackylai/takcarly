// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Elderly, User, ScheduledItem } = initSchema(schema);

export {
  Elderly,
  User,
  ScheduledItem
};