const url =
  window.location.hostname == 'localhost'
    ? 'http://localhost:7001'
    : 'https://s.todo.redsols.com';

export const environment = {
  // apiUrl: 'https://s.todo.redsols.com',
  apiUrl: url,
};
