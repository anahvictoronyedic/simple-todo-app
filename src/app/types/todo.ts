
export enum TODO_STATUS {
  COMPLETED = 1,
  IN_PROGRESS
}

export interface TODO {
  title: string;
  status: TODO_STATUS;
}
