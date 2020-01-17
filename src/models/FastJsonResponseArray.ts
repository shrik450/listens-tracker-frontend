import { FastJsonResponseData } from './FastJsonResponseData';
import { PaginationDetails } from './Pagination';

export class FastJsonResponseArray<ResponseType> {
    constructor(
        public data: FastJsonResponseData<ResponseType>[],
        public meta: PaginationDetails
    )
    { }
}
