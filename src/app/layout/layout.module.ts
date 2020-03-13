import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
// import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingComponent } from "./loading/loading.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { NzGridModule } from "ng-zorro-antd/grid";

@NgModule({
  imports: [CommonModule, NgZorroAntdModule, NzGridModule],
  declarations: [LoadingComponent],
  exports: [LoadingComponent, NgZorroAntdModule, NzGridModule]
})
export class LayoutModule {}
