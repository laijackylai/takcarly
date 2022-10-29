import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

type EagerScheduledItem = {
  readonly datetime?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly completed?: boolean | null;
  readonly starred?: boolean | null;
  readonly images?: (string | null)[] | null;
}

type LazyScheduledItem = {
  readonly datetime?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly completed?: boolean | null;
  readonly starred?: boolean | null;
  readonly images?: (string | null)[] | null;
}

export declare type ScheduledItem = LazyLoading extends LazyLoadingDisabled ? EagerScheduledItem : LazyScheduledItem

export declare const ScheduledItem: (new (init: ModelInit<ScheduledItem>) => ScheduledItem)

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerUser = {
  readonly id: string;
  readonly name: string;
  readonly linkedElderly?: (string | null)[] | null;
  readonly schedule?: (ScheduledItem | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly name: string;
  readonly linkedElderly?: (string | null)[] | null;
  readonly schedule?: (ScheduledItem | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}