export type TaskType = 'long-term' | 'short-term' | 'daily';

export type TaskData = {
  created_date: string;
  due_date: string;
  id: number;
  task_complete: boolean;
  task_name: string;
  task_renewed: boolean;
  task_type: TaskType;
  user_id: number;
};

export type ItemData = {
  id: number;
  item_cost: number;
  item_type: string;
  model_key: string;
  name: string;
}
export type ItemUserData = {
  id: number;
  item_cost: number;
  item_type: string;
  model_key: string;
  name: string;
  owned: boolean;
}

export type BalanceData = {
  balance: number;
}

export type PostPutPatchTaskResponse = {
  message: string;
  task: TaskData;
};

export type PostTaskRequired = {
  user_id: number;
  task_name: string;
  task_type: TaskType;
  due_date: Date;
};

export type AuthUserData = {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
};

export type UserInfoField = 'username' | 'first_name' | 'last_name' | 'email' | 'password';

export type UserInfo = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  message: string;
  user: UserInfo & { id: number };
};

export type UserUpdateResponse = SignupResponse & { token: string };
