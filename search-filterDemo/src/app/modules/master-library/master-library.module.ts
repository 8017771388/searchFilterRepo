import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';
import { BsDatepickerModule, CollapseModule , ModalModule  } from 'ngx-bootstrap';
import { CategoryComponent } from './components/category/category.component';
import { GoalComponent } from './components/goal/goal.component';
import { MasterLibraryRoutingModule } from './master-library.routing.module';
import { MasterLibraryService } from './services/master-library.service';
import { MasterLibraryPageComponent } from './components/master-library-page/master-library-page.component';
import { TabsModule } from 'ngx-bootstrap';
import { TaskComponent } from './components/task/task.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { AddGoalComponent } from './components/add-goal/add-goal.component';
import { AddTaskComponent } from './components/add-task/add-task.component';

@NgModule({
    declarations: [CategoryComponent, MasterLibraryPageComponent, GoalComponent, TaskComponent, AddCategoryComponent, AddGoalComponent, AddTaskComponent],
  imports: [
    CommonModule,
    SharedModule,
    MasterLibraryRoutingModule,
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    ],
    entryComponents: [AddCategoryComponent, AddGoalComponent, AddTaskComponent],
  providers: [MasterLibraryService]
})
export class MasterLibraryModule { }
