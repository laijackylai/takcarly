// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Elderly, ScheduledItem, User } = initSchema(schema);

export {
  Elderly,
  ScheduledItem,
  User
};