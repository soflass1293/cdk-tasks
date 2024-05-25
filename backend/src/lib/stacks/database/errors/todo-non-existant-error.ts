export class TodoNonExistantError extends Error {
  constructor(message = 'Todo does not exist') {
    super(message);
    this.name = 'TodoNonExistant';
  }
}
