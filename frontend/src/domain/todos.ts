import { client, gql } from "./graphql/client";
import {
  CreateTodoDocument,
  DeleteTodoDocument,
  GetTodosDocument,
  ToggleCompletedDocument,
  type CreateTodoInput,
  type DeleteTodoInput,
  type ToggleCompletedInput,
} from "./graphql/generated";

const getTodos = () => {
  return client.query({
    query: GetTodosDocument,
    fetchPolicy: "no-cache",
  });
};

const createTodo = (input: CreateTodoInput) => {
  return client.mutate({
    mutation: CreateTodoDocument,
    variables: {
      input,
    },
  });
};

const toggleTodo = (input: ToggleCompletedInput) => {
  return client.mutate({
    mutation: ToggleCompletedDocument,
    variables: {
      input,
    },
  });
};

const deleteTodo = (input: DeleteTodoInput) => {
  return client.mutate({
    mutation: DeleteTodoDocument,
    variables: {
      input,
    },
  });
};

export { getTodos, createTodo, toggleTodo, deleteTodo, gql };
