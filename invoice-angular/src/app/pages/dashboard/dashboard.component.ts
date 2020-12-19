import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['invoice_id', 'amount', 'selling_price', 'due_on'];
  dataSource: IInvoice[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  length: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.getData();
  }

  async getData() {
    try {
      const offset = this.pageSize * this.pageIndex;
      const res = await fetch(`http://localhost:5000/api/v1/invoice/list?offset=${offset}&limit=${this.pageSize}`)
        .then(resp => resp.json())
      this.dataSource = res.result.models;
      const { count } = res.result.meta;
      this.length = count;
    } catch (e) {
      console.log(e)
    }
  }
  openFile(){
    document.getElementById("fileInput").click();
  }
  async uploadFile(file: File) {
    try {
      const body = new FormData();
      body.append('invoice', file);
      const res = await fetch('http://localhost:5000/api/v1/invoice/upload', {
        method: 'POST',
        body: body
      }).then(res => res.json());
      await this.getData();
    } catch (e) {
      console.log(e)
    }
  }
  async fileChange($event) {
    if ($event.target.files && $event.target.files.length) {
      const file = $event.target.files[0];
      await this.uploadFile(file);
    }
  }
  async onChangePage($event) {
    const { pageIndex, pageSize } = $event;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    await this.getData();
  }

}

export interface IInvoice {
  id: number;
  invoice_id: string;
  selling_price: number;
  amount: number;
  due_on: string;
}

