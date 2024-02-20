//create Task interface
export interface Todo {
  id?: string;
  title: string;
  completed?: boolean;
  date?: any;
  repeat?: string;
  remind?: boolean;
  important?: boolean;
  token?: string;
  uid?: string;
  username?: string;
}
