import { Todo } from "./domain/graphql/generated";
import { getTodos, toggleTodo, deleteTodo, createTodo } from "./domain/todos";
import { subscribe } from "./domain/subscription";
document.addEventListener("alpine:init", () => {
  // @ts-ignore
  Alpine.data("todos_form", () => ({
    name: "",
    handleSubmit() {
      createTodo({ name: this.name });
      this.name = "";
    },
  }));
  type Filter = "all" | "active" | "completed";
  type TodosList = {
    todos: (Todo | null)[];
    filteredTodos: (Todo | null)[];
    filter: Filter;
    retrieve: () => void;
    handleInit: () => void;
    handleToggleCompleted: (id: string) => void;
    handleDelete: (id: string) => void;
    handleFilter: (filter: Filter) => void;
  };
  // @ts-ignore
  Alpine.data("todos_list", (): TodosList => {
    return {
      todos: [],
      filteredTodos: [],
      filter: "all",
      async handleInit() {
        this.retrieve();
        subscribe((error, data) => {
          if (error) {
            console.info(error);
          } else if (data) {
            this.retrieve();
          }
        });
      },
      async retrieve() {
        const fn = async () => {
          try {
            const { data } = await getTodos();
            if (data.getTodos && Array.isArray(data.getTodos)) {
              this.todos = data.getTodos;
              this.filteredTodos = data.getTodos;
            }
          } catch (error) {
            console.info(error);
          }
        };
        fn();
      },
      handleToggleCompleted(id: string) {
        const fn = async () => {
          try {
            await toggleTodo({ id });
          } catch (error) {
            console.info(error);
          }
        };
        fn();
      },
      handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this item?")) {
          const fn = async () => {
            try {
              await deleteTodo({ id });
            } catch (error) {
              console.info(error);
            }
          };
          fn();
        }
      },
      handleFilter(filter: Filter) {
        if (filter === "all") {
          this.filter = "all";
          this.filteredTodos = this.todos;
        } else if (filter === "active") {
          this.filter = "active";
          this.filteredTodos = this.todos.filter(
            (todo) => todo && todo.completed === false,
          );
        } else if (filter === "completed") {
          this.filter = "completed";
          this.filteredTodos = this.todos.filter(
            (todo) => todo && todo.completed === true,
          );
        }
      },
    };
  });
});
