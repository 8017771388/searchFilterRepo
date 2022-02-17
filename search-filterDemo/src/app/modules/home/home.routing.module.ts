import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuildCorePlanComponent } from './components/build-core-plan/build-core-plan.component';
import { CorePlanComponent } from './components/core-plan/core-plan.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HomeCalendarComponent } from './components/home-calendar/home-calendar.component';
//import { AuthGuardService } from '../_shared/guards/auth.guard';

const routes: Routes = [
    // {
    //     path: '', pathMatch: 'full', redirectTo: 'home-page'
    // },
    { 
        path: 'build-core-plan/:repid/:advisor/:vcfo',
        component: BuildCorePlanComponent
    },
    {
        path: 'build-core-plan/:repid/:advisorname/:cfoname/:cfousername',
        component: BuildCorePlanComponent
    },
    {
        path: 'core-plan/:repid/:advisor',
        component: CorePlanComponent,
        // canActivate: [AuthGuardService],
        // data : {role : ['Guest']}
    },
    {
        path: 'home-calendar',
        component: HomeCalendarComponent
        
    },
    {
        path: '',
        component: HomePageComponent        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
