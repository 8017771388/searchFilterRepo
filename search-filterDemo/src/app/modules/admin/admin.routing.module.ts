import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvisorProfileComponent } from './components/advisor-profile/advisor-profile.component';
import { HomeProfileComponent } from './components/home-profile/home-profile.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { AuthGuardService } from '../_shared/guards/auth.guard';
import { AdvisorSubcriptionComponent } from './components/advisor-subcription/advisor-subcription.component';

const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'admin-page'
    },
    {
        path: 'admin-page',
        component: AdminPageComponent
    },
    {
        path: 'advisor-subcription',
        component: AdvisorSubcriptionComponent
    },
    {
        path: 'advisor-profile',
        component: AdvisorProfileComponent
    },
    {
        path: 'home-profile',
        component: HomeProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
