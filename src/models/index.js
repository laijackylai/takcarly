// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, ScheduledItem } = initSchema(schema);

export {
  User,
  ScheduledItem
};