import {Features} from "./features.model";

export interface PagesFeatures {

  content: Features[],
  pageable: {
    sort: {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    },
    offset: number,
    pageSize: number,
    pageNumber: number,
    unpaged: boolean,
    paged: boolean
  },
  last: boolean,
  totalPages: number,
  totalElements: number,
  size: number,
  number: number,
  sort: {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
  },
  first: boolean,
  numberOfElements: number,
  empty: boolean
}
