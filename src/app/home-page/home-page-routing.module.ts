import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbcLabsHomePageComponent } from './atrocel-hris-home-page/atrocel-hris-home-page.component';


const routes: Routes = [
  {
    path: '',
    component: AbcLabsHomePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }