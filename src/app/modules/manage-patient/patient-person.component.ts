import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/local-storage.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient-person.component.html',
  styleUrls: ['./patient-person.component.scss']
})
export class PatientPersonComponent {
  userData: any = {};

  constructor(private localStorageService: LocalStorageService) {}

  saveToLocalStorage() {
    const key = this.userData.name; // Use the name field as the key
    if (!key) {
      alert("Please enter a name before saving.");
      return;
    }
    this.localStorageService.setItem(key, JSON.stringify(this.userData));
    alert("Data saved to local storage!");
  }

  retrieveFromLocalStorage() {
    const key = this.userData.name; // Use the name field to retrieve data
    if (!key) {
      alert("Please enter a name to retrieve data.");
      return;
    }
    const userDataString = this.localStorageService.getItem(key);
    if (userDataString) {
      this.userData = JSON.parse(userDataString);
    } else {
      console.log("No data found in local storage for the provided name!");
    }
  }
}
