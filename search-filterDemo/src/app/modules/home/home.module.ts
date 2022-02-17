import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home.routing.module';
import { SharedModule } from '../_shared/shared.module';
import { BsDatepickerModule, CollapseModule , ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { BuildCorePlanComponent } from './components/build-core-plan/build-core-plan.component';
import { CorePlanComponent } from './components/core-plan/core-plan.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CorePlanService } from './services/core-plan.service';
import { DxDataGridModule } from 'devextreme-angular';
import { UiSwitchModule } from 'ngx-ui-switch';
import { HomeService } from './services/home.service';
import { TypeaheadModule } from 'ngx-bootstrap';
import { OrderModule } from 'ngx-order-pipe';
import { ViewNotificationsComponent } from './components/view-notifications/view-notifications.component';
import { ViewUnreadNotesComponent } from './components/view-unread-notes/view-unread-notes.component';
import { HomeCalendarComponent } from './components/home-calendar/home-calendar.component';
import { AddTaskCalendarComponent } from './components/add-task-calendar/add-task-calendar.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    BuildCorePlanComponent,
    CorePlanComponent ,
    HomePageComponent,
    ViewNotificationsComponent,
    ViewUnreadNotesComponent,
    HomeCalendarComponent,
    AddTaskCalendarComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    DxDataGridModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    UiSwitchModule.forRoot({
      size: 'small',
      color: '#3f681c',
      switchColor: '#ffffff',
      defaultBgColor: '#ecebeb',
      defaultBoColor : '#094f00',
      checkedLabel: 'Deselect',
      uncheckedLabel: 'Select'
    }),    
    TypeaheadModule.forRoot(),
    OrderModule,
    NgSelectModule
  ],
  providers : [
    CorePlanService,
    HomeService
  ],
  entryComponents : [ViewNotificationsComponent, ViewUnreadNotesComponent, AddTaskCalendarComponent]
})
export class HomeModule { }

