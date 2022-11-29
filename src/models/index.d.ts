import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";

type ScheduledItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ElderlyMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerScheduledItem = {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly type: string;
  readonly date: string;
  readonly time: string;
  readonly completed: boolean;
  readonly starred: boolean;
  readonly images?: (string | null)[] | null;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyScheduledItem = {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly type: string;
  readonly date: string;
  readonly time: string;
  readonly completed: boolean;
  readonly starred: boolean;
  readonly images?: (string | null)[] | null;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ScheduledItem = LazyLoading extends LazyLoadingDisabled ? EagerScheduledItem : LazyScheduledItem

export declare const ScheduledItem: (new (init: ModelInit<ScheduledItem, ScheduledItemMetaData>) => ScheduledItem) & {
  copyOf(source: ScheduledItem, mutator: (draft: MutableModel<ScheduledItem, ScheduledItemMetaData>) => MutableModel<ScheduledItem, ScheduledItemMetaData> | void): ScheduledItem;
}

type EagerElderly = {
  readonly id: string;
  readonly code: string;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyElderly = {
  readonly id: string;
  readonly code: string;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Elderly = LazyLoading extends LazyLoadingDisabled ? EagerElderly : LazyElderly

export declare const Elderly: (new (init: ModelInit<Elderly, ElderlyMetaData>) => Elderly) & {
  copyOf(source: Elderly, mutator: (draft: MutableModel<Elderly, ElderlyMetaData>) => MutableModel<Elderly, ElderlyMetaData> | void): Elderly;
}

type EagerUser = {
  readonly id: string;
  readonly name: string;
  readonly Elderlies?: (Elderly | null)[] | null;
  readonly ScheduledItems?: (ScheduledItem | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly name: string;
  readonly Elderlies: AsyncCollection<Elderly>;
  readonly ScheduledItems: AsyncCollection<ScheduledItem>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}