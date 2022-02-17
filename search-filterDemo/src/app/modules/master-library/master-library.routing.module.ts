import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { MasterLibraryPageComponent } from './components/master-library-page/master-library-page.component';
import { AuthGuardService } from '../_shared/guards/auth.guard';
import { ADMIN, GUEST } from '../_shared/constants/global.constant';



const routes: Routes = [
    {
        path: 'category',
        component: CategoryComponent
    },
    {
        path: 'master-library-page',
        component: MasterLibraryPageComponent,
        canActivate: [AuthGuardService],
        data : {role : [ADMIN]}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterLibraryRoutingModule { }
