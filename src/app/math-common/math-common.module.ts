import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsConfig, HighchartsModule } from '@howtimeflies/ngx-highcharts';
import { KatexModule } from 'ng-katex';

const config: HighchartsConfig = {
    cdnBaseUrl: "https://code.highcharts.com",
    scriptName: "highcharts.js",
    delayToExecuteModulesCode: 200,
    maxDelayToResizeContainer: 10000,
    globalOptions: {
        lang: {
            drillUpText: "Drill-Up"
        }
    }
};


@NgModule({
    declarations: [],
    imports: [CommonModule, HighchartsModule, KatexModule],
    exports: [HighchartsModule, KatexModule],
    providers: [{ provide: HighchartsConfig, useValue: config }]
})
export class MathCommonModule { }
