import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ModalConfig, ModalComponent } from "../../_metronic/partials";
import { TodoService } from "src/app/services/todo.service";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  todo: any;
  status: number | null = null;
  modalConfig: ModalConfig = {
    modalTitle: "Modal title",
    dismissButtonLabel: "Submit",
    closeButtonLabel: "Cancel",
  };
  @ViewChild("modal") private modalComponent: ModalComponent;
  constructor(
    private todoService: TodoService,
    private detectRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.todoService.getTodo().subscribe(
      (response: HttpResponse<any>) => {
        this.todo = response.body;
        this.status = response.status;
        console.log(this.status);
        this.detectRef.detectChanges();
      },
      (error: HttpErrorResponse) => {
        console.error("Error fetching data from API", error);
        this.status = error.status;
        console.log(this.status);
        this.detectRef.detectChanges();
      }
    );
  }

  async openModal() {
    return await this.modalComponent.open();
  }
}
