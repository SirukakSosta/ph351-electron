import { Component, OnInit } from "@angular/core";
import { EdLabService } from "../ed-lab.service";
import { EdCoreService } from "../ed-core.service";

@Component({
  selector: "app-ed-wrapper",
  templateUrl: "./ed-wrapper.component.html",
  styleUrls: ["./ed-wrapper.component.scss"]
})
export class EdWrapperComponent implements OnInit {
  // todo
  // play with https://github.com/sasekazu/visualize-jacobi-diagonalization/blob/master/js/main.js

  constructor(
    // private lab: EdLabService,
    private _edCoreService: EdCoreService
  ) {}

  ngOnInit(): void {
    // this.lab.diagonalize()
  }
}
