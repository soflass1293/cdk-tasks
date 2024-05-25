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
    todos: [],
    handleInit() {},
    handleToggleCompleted(id: string) {
      console.log("completed", id);
    },
    handleDelete(id: string) {
      console.log("delete", id);
    },
  }));
});
