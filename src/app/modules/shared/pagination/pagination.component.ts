import { Component, Input, OnInit, OnChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() totalRecords = 0;
  @Input() recordsPerPage = 0;

  @Output() onPageChange: EventEmitter<number> = new EventEmitter();

  public pages: number[] = [];
  activePage: any;

  constructor(private ref: ChangeDetectorRef,) { }

  ngOnInit(): void {
    const pageCount = this.getPageCount();
    this.pages = this.getArrayOfPage(pageCount);
    this.activePage = 1;
    this.ref.detectChanges();
  }

  ngOnChanges(): any {
    const pageCount = this.getPageCount();
    this.pages = this.getArrayOfPage(pageCount);
    this.activePage = 1;
    this.onPageChange.emit(1);
  }

  private getPageCount(): number {
    let totalPage = 0;

    if (this.totalRecords > 0 && this.recordsPerPage > 0) {
      const pageCount = this.totalRecords / this.recordsPerPage;
      const roundedPageCount = Math.floor(pageCount);

      totalPage = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
    }

    return totalPage;
  }

  private getArrayOfPage(pageCount: number): number[] {
    const pageArray = [];
    const start = this.activePage - 3 < 1 ? 1 : this.activePage - 3
    const end = this.activePage + 3 > pageCount ? pageCount : this.activePage + 3
    for (let i = start; i <= end; i++) {
      pageArray.push(i);
    }

    return pageArray;
  }

  onClickPage(pageNumber: number): void {
    this.activePage = pageNumber;
    const pageCount = this.getPageCount();
    this.pages = this.getArrayOfPage(pageCount);
    this.onPageChange.emit(this.activePage);
  }

  showOnRecords() {
    let start = (this.activePage * this.recordsPerPage) - this.recordsPerPage + 1
    let end = this.activePage * this.recordsPerPage
    return start + ' - ' + (end < this.totalRecords ? end : this.totalRecords)
  }
}
