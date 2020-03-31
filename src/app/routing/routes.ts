import { Routes } from "@angular/router";
import { CoreComponent } from "../core/core/core.component";

export const routes: Routes = [
  {
    path: "",
    canActivate: [],
    children: [
      {
        path: "core",
        component: CoreComponent,
        canActivate: [],
        children: [
          {
            path: "pde",
            loadChildren: () =>
              import("../pde/pde.module").then(e => e.PdeModule)
          },
          {
            path: "ed",
            loadChildren: () => import("../ed/ed.module").then(e => e.EdModule)
          },
          {
            path: "",
            redirectTo: "/core/pde",
            pathMatch: "full"
          }
        ]
      },
      {
        path: "",
        redirectTo: "/core/pde",
        pathMatch: "full"
      }
    ]
  },
  { path: "**", redirectTo: "/core" }
];
