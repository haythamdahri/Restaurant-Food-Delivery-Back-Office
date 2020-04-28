import { Sort } from "./Sort";

export class Pageable {
  sort!: Sort;
  pageSize: number;
  pageNumber: number;
  offset!: number;
  unpaged!: boolean;
  paged!: boolean;

  static readonly DEFAULT_PAGE_SIZE = 20;
  static readonly FIRST_PAGE_NUMBER = 0;

  public constructor() {
    this.pageSize = Pageable.DEFAULT_PAGE_SIZE;
    this.pageNumber = Pageable.FIRST_PAGE_NUMBER;
  }
}
