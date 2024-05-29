export class PaginatedEntity<T> {
  data: T[];
  meta: {
    totalPage: number;
    totalData: number;
    page: number;
    limit: number;
  };

  constructor(
    data: T[],
    meta: {
      totalData: number;
      page: number;
      limit: number;
    },
  ) {
    this.data = data;
    this.meta = {
      limit: +meta.limit,
      page: +meta.page,
      totalData: +meta.totalData,
      totalPage: Math.ceil(meta.totalData / meta.limit),
    };
  }
}
