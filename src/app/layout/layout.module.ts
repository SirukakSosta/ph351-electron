import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
// import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingComponent } from "./loading/loading.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzSliderModule } from "ng-zorro-antd/slider";

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    NzGridModule,
    NzLayoutModule,
    NzInputModule
  ],
  declarations: [LoadingComponent],
  exports: [
    LoadingComponent,
    NgZorroAntdModule,
    NzGridModule,
    NzLayoutModule,
    NzInputModule,
    NzButtonModule,
    NzRadioModule,
    NzSliderModule
  ]
})
export class LayoutModule {}
