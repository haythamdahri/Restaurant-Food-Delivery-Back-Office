import { Page } from "../Page";
import { Pageable } from "../Pageable";

class CustomPaginationService {

  public getNextPage(page: Page<any>): Pageable {
    if (!page.last) {
      page.pageable.pageNumber = page.pageable.pageNumber + 1;
    }
    return page.pageable;
  }

  public getPreviousPage(page: Page<any>): Pageable {
    if (!page.first) {
      page.pageable.pageNumber = page.pageable.pageNumber - 1;
    }
    return page.pageable;
  }

  public getPageInNewSize(page: Page<any>, pageSize: number): Pageable {
    page.pageable.pageSize = pageSize;
    page.pageable.pageNumber = Pageable.FIRST_PAGE_NUMBER;

    return page.pageable;
  }
  
}

export default new CustomPaginationService();