import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { OutsideComponent } from './core/outside-app.component';
import { InsideComponent } from './core/inside-app.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  // Rutas que no requieren inicio de sesión
  {
    path: '',
    component: OutsideComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
      },
      // {
      //   path: 'register',
      //   loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule)
      // },
      // {
      //   path: 'register/:ref',
      //   loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule)
      // }
    ],
  },


  // Rutas que requieren inicio de sesión
  {
    path: '',
    canActivate: [AuthGuard],
    component: InsideComponent,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'academy',
        loadChildren: () => import('./pages/academy/academy.module').then(m => m.AcademyModule)
      },
      {
        path: 'support',
        loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
      },
      {
        path: 'buytoken',
        loadChildren: () => import('./pages/buy-token/buy-token.module').then(m => m.BuyTokenModule)
      },
      {
        path: 'referrals',
        loadChildren: () => import('./pages/referrals/referrals.module').then(m => m.ReferralsModule)
      },
      {
        path: 'nfts',
        loadChildren: () => import('./pages/nfts/nfts.module').then(m => m.NftsModule)
      },
      {
        path: 'trader',
        loadChildren: () => import('./pages/trader/trader.module').then(m => m.TraderModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryModule)
      },
      {
        path: 'my-nfts',
        loadChildren: () => import('./pages/my-nfts/my-nfts.module').then(m => m.MyNftsModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
