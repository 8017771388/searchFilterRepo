import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationService } from './modules/_shared/services/authentication.service';
import { ErrorComponent } from './modules/error/component/error.component';
import { SignOutComponent } from './modules/_shared/components/sign-out/sign-out.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
      path: 'home',
      loadChildren: './modules/home/home.module#HomeModule',
      //loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
      resolve: { auth: AuthenticationService }
  },
  {
    path: 'admin',
    loadChildren: './modules/admin/admin.module#AdminModule',
    //loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    resolve: { auth: AuthenticationService }
},
{
  path: 'master-library',
  loadChildren: './modules/master-library/master-library.module#MasterLibraryModule',
  //loadChildren: () => import('./modules/master-library/master-library.module').then(m => m.MasterLibraryModule),
  resolve: { auth: AuthenticationService }
},
{
  path: 'quickbook',
  loadChildren: './modules/quickbook/quickbook.module#QuickbookModule',
  //loadChildren: () => import('./modules/master-library/master-library.module').then(m => m.MasterLibraryModule),
  resolve: { auth: AuthenticationService }
},
{ path: 'error', component: ErrorComponent, data: { title: 'Error' } },
{ path: 'signout', component : SignOutComponent},
{ path: '**', redirectTo: '/error'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
