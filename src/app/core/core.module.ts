import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '../layout/layout.module';
import { CoreComponent } from './core/core.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [CoreComponent, HeaderComponent],
  imports: [CommonModule, RouterModule, LayoutModule] 
})
export class CoreModule { }
