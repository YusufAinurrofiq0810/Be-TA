export type Paginated<T> = {
  data: T[];
  meta: {
    totalPage: number;
    totalData: number;
    page: number;
    limit: number;
  };
};
