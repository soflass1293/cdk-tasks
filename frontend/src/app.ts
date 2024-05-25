type Todo = {
  id: string;
  name: string;
  completed: boolean;
  createdAt?: Date;
};
type Filter = "all" | "active" | "completed";
document.addEventListener("alpine:init", () => {
  // @ts-ignore
  Alpine.data("todos_form", () => ({
    name: "",
    handleSubmit() {
      this.name = "";
    },
  }));
  // @ts-ignore
  Alpine.data("todos_list", () => ({
    todos: [] as Todo[],
    filteredTodos: [] as Todo[],
    filter: "all" as Filter,
    handleInit() {
      fetch("https://jsonplaceholder.typicode.com/todos")
        .then((response) => response.json())
        .then((json) => {
          this.todos = json;
          this.filteredTodos = json;
        });
    },
    handleToggleCompleted(id: string) {
      console.log("completed", id);
    },
    handleDelete(id: string) {
      console.log("delete", id);
    },
    handleFilter(filter: Filter) {
      if (filter === "all") {
        this.filter = "all";
        this.filteredTodos = this.todos;
      } else if (filter === "active") {
        this.filter = "active";
        this.filteredTodos = this.todos.filter(
          (todo) => todo.completed === true,
        );
      } else if (filter === "completed") {
        this.filter = "completed";
        this.filteredTodos = this.todos.filter(
          (todo) => todo.completed === false,
        );
      }
    },
  }));
});
