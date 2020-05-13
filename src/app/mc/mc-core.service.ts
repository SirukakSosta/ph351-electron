import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class McCoreService {
  private destroyExp$: Subject<number>;

  constructor() {
    console.log("starting");
    // this.start();
  }
 
}
