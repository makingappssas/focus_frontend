import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyNftsComponent } from './my-nfts.component';

const routes: Routes = [
  {
    path: '',
    component: MyNftsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyNftsRoutingModule { }
