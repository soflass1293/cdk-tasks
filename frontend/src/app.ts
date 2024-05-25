type Todo = {
  id: string,
  name: string,
  completed: boolean,
  createdAt?: Date
}
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
    handleInit(){
      fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(json => this.todos=(json))
    },
    handleToggleCompleted(id: string) {
      console.log("completed", id);
    },
    handleDelete(id: string) {
      console.log("delete", id);
    },
  }));
});
