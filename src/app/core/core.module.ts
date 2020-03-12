import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreComponent } from './core/core.component';

@NgModule({
  declarations: [CoreComponent],
  imports: [CommonModule, RouterModule] 
})
export class CoreModule { }
