export type LoginFormValues = {
  username: string;
  password: string;
};

export type User = {
  id: number;
  username: string;
  created_at: string;
};

export type Todo = {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
  owner_id: number;
  created_at: string;
  updated_at: string | null;
};

export type TodoPayload = {
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
};