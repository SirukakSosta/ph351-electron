import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
// NG Translate 
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { PlotlyModule } from "angular-plotly.js";
import * as PlotlyJS from "plotly.js/dist/plotly.js";
import "reflect-metadata";
import "../polyfills";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { LayoutModule } from "./layout/layout.module";
import { PdeModule } from "./pde/pde.module";
import { AppRoutingModule } from "./routing/routing.module";
import { SharedModule } from "./shared/shared.module";



PlotlyModule.plotlyjs = PlotlyJS;
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    PdeModule,
    PlotlyModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LayoutModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
