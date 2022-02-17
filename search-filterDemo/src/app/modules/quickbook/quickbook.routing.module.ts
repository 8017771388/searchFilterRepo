import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportadvisorComponent } from './components/importadvisor/importadvisor.component';
import { CoamaintenanceComponent } from './components/coamaintenance/coamaintenance.component';
import { AdvisoronboardingComponent } from './components/advisoronboarding/advisoronboarding.component';
import { CoamasterdataComponent } from './components/coamasterdata/coamasterdata.component';
import { JeviewComponent } from './components/jeview/jeview.component';
import { AuthGuardService } from '../_shared/guards/auth.guard';
import { EqblplconnectComponent } from './components/eqblplconnect/eqblplconnect.component';
import { QuickbookComponent } from "./quickbook.component";
const routes: Routes = [
  {
    path: "quickbook",
    component: QuickbookComponent,
    children: [
    /* { path: 'login', component: LoginComponent }, */
    { path: 'importadvisor', component: ImportadvisorComponent},
    { path: 'quickbook', component: QuickbookComponent},
     { path: 'advisoronboarding', component: AdvisoronboardingComponent},
    { path: 'coamaintenance', component: CoamaintenanceComponent },
    { path: 'coamasterdata', component: CoamasterdataComponent },
    { path: 'eqblplconnect', component: EqblplconnectComponent },
    { path: 'jeview', component: JeviewComponent },
    { path: '**', redirectTo: 'sidebar'}
    ]
  }
  ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
