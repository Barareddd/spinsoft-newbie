import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-toolbar',
  templateUrl: './purchase-toolbar.component.html',
})
export class PurchaseToolbarComponent implements OnInit {
  appPurchaseUrl: string = "https://1.envato.market/EA4JP";

  constructor() {
  }

  ngOnInit(): void {
  }
}
