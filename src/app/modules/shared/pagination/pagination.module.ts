import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from './pagination.component';

@NgModule({
    imports: [RouterModule, CommonModule],
    declarations: [PaginationComponent],
    exports: [PaginationComponent]
})

export class PaginationModule { }
