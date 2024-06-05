import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LocalStorageService } from "src/app/local-storage.service";

interface Patient {
  name: string;
  surname: string;
  number: string;
}

@Component({
  selector: "app-patient",
  templateUrl: "./patient-person.component.html",
  styleUrls: ["./patient-person.component.scss"],
})
export class PatientPersonComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService
  ) {
    this.myForm = this.fb.group({
      name: "",
      surname: "",
      number: "",
      patients: [[] as Patient[]],
    });

    this.myForm.valueChanges.subscribe(console.log);
  }

  saveToLocalStorage() {
    const formData = this.myForm.value;

    if (!formData.name || !formData.surname || !formData.number) {
      alert("Please enter all required fields.");
      return;
    }

    const patientData: Patient = {
      name: formData.name,
      surname: formData.surname,
      number: formData.number,
    };

    const updatedPatients = [...formData.patients, patientData];

    this.localStorageService.setItem(
      "patientData",
      JSON.stringify(updatedPatients)
    );

    alert("Data saved to local storage!");

    this.myForm.patchValue({
      patients: updatedPatients,
      name: "",
      surname: "",
      number: "",
    });

    this.retrieveFromLocalStorage();
  }

  retrieveFromLocalStorage() {
    const storedDataString = this.localStorageService.getItem("patientData");

    if (storedDataString) {
      const storedData: Patient[] = JSON.parse(storedDataString);

      this.myForm.patchValue({
        patients: storedData || [],
      });

      console.log(this.myForm.value.patients);
      alert("Data retrieved from local storage!");
    } else {
      console.log("No data found in local storage!");
    }
  }

  ngOnInit() {
    this.retrieveFromLocalStorage();
  }
}
