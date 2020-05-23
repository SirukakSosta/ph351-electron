import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzSliderModule } from "ng-zorro-antd/slider";
// import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingComponent } from "./loading/loading.component";
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
    NzSliderModule,
    NzProgressModule
  ]
})
export class LayoutModule { }
