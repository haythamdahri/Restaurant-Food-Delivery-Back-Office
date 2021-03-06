import { ReviewModel } from './ReviewModel';

export default class ReviewsPageModel {
  public content!: ReviewModel[];
  public pageable!: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageSize: number;
    pageNumber: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  public totalPages!: number;
  public totalElements!: number;
  public last!: boolean;
  public first!: boolean;
  public sort!: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  public size!: number;
  public number!: number;
  public numberOfElements!: number;
  public empty!: boolean;
}
