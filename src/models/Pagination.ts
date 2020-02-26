export class PaginationDetails {
  constructor(
    public total_records: number,
    public total_pages: number,
    public current_page: number
  ) {}
}
