export type WhereFilter<T> = {
  [K in keyof T]?: {
    equals?: T[K];
    gt?: T[K];
    gte?: T[K];
    lt?: T[K];
    lte?: T[K];
  };
};

export type OrderBy<T> = {
  [K in keyof T]?: "asc" | "desc";
};

export interface QueryOptions<T> {
  where?: WhereFilter<T>;
  orderBy?: OrderBy<T>;
  limit?: number;
}
