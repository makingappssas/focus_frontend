import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyTokenComponent } from './buy-token.component';

const routes: Routes = [
  {
    path: '',
    component: BuyTokenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyTokenRoutingModule { }
