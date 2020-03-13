import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingComponent } from "./loading/loading.component";

@NgModule({
    imports: [CommonModule,NgbModule],
    declarations: [LoadingComponent],
    exports: [LoadingComponent,NgbModule]
})
export class LayoutModule { }
