// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ScheduledItem, Elderly, User } = initSchema(schema);

export {
  ScheduledItem,
  Elderly,
  User
};