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

type ElderlyMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerElderly = {
  readonly id: string;
  readonly Code?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyElderly = {
  readonly id: string;
  readonly Code?: string | null;
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