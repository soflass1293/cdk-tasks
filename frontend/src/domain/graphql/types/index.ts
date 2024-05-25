/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AWSDateTime: { input: any; output: any };
  AWSJSON: { input: any; output: any };
  AWSURL: { input: any; output: any };
};

export type CreateTodoInput = {
  name: Scalars["String"]["input"];
};

export type DeleteTodoInput = {
  id: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  createTodo?: Maybe<Todo>;
  deleteTodo?: Maybe<Scalars["Boolean"]["output"]>;
  toggleCompleted?: Maybe<Todo>;
};

export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};

export type MutationDeleteTodoArgs = {
  input: DeleteTodoInput;
};

export type MutationToggleCompletedArgs = {
  input: ToggleCompletedInput;
};

export type Query = {
  __typename?: "Query";
  getTodos?: Maybe<Array<Maybe<Todo>>>;
};

export type Subscription = {
  __typename?: "Subscription";
  onTodoCreated?: Maybe<Todo>;
  onTodoDeleted?: Maybe<Scalars["Boolean"]["output"]>;
  onTodoUpdated?: Maybe<Todo>;
};

export type Todo = {
  __typename?: "Todo";
  completed?: Maybe<Scalars["Boolean"]["output"]>;
  createdAt?: Maybe<Scalars["AWSDateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type ToggleCompletedInput = {
  id: Scalars["String"]["input"];
};
