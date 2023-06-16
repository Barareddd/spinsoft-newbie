import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-drawer',
  templateUrl: './help-drawer.component.html',
})
export class HelpDrawerComponent implements OnInit {
  appThemeName: string = "Metronic";
  appPurchaseUrl: string = "https://1.envato.market/EA4JP";

  constructor() {
  }

  ngOnInit(): void {
  }
}
