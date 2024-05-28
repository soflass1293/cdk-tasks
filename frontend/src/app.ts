import { Todo } from "./domain/graphql/generated";
import { subscribe } from "./domain/subscription";
import { getTodos, toggleTodo, deleteTodo, createTodo } from "./domain/todos";
document.addEventListener("alpine:init", () => {
  // @ts-ignore
  Alpine.data("todos_form", () => ({
    name: "",
    loading: false,
    async handleSubmit() {
      this.loading = true;
      await createTodo({ name: this.name });
      this.loading = false;
      this.name = "";
    },
  }));
  type Filter = "all" | "active" | "completed";
  type TodosList = {
    todos: (Todo | null)[];
    loading: boolean;
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
      loading: false,
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
            this.loading = true;
            const { data } = await getTodos();
            this.loading = false;
            if (data.getTodos && Array.isArray(data.getTodos)) {
              this.todos = data.getTodos;
              this.filteredTodos = data.getTodos;
            }
          } catch (error) {
            this.loading = false;
            console.info(error);
          }
        };
        void fn();
      },
      handleToggleCompleted(id: string) {
        const fn = async () => {
          try {
            this.loading = true;
            await toggleTodo({ id });
          } catch (error) {
            console.info(error);
          }
        };
        void fn();
      },
      handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this item?")) {
          const fn = async () => {
            try {
              this.loading = true;
              await deleteTodo({ id });
              this.retrieve();
            } catch (error) {
              console.info(error);
            }
          };
          void fn();
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
