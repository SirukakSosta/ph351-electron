import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
// import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingComponent } from "./loading/loading.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
@NgModule({
  imports: [CommonModule, NgZorroAntdModule],
  declarations: [LoadingComponent],
  exports: [LoadingComponent, NgZorroAntdModule]
})
export class LayoutModule {}
