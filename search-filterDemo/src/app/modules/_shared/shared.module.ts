import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SafeHtmlPipe } from './pipes/pipe.safehtml';
import {BooleanConverterpipe} from './pipes/pipe.boolean.converter';
import { UpperCaseDirective } from './directives/uppercase';
import { PhoneNumberDirective } from './directives/phoneNumber';
import { ZipConverterDirective } from './directives/zipConverter';
import { FilterPipe } from './pipes/pipe.filter';
import { BooleanFilterPipe } from './pipes/pipe.boolean.filter';
import { HeaderComponent } from './components/header/header.component';
import { SideBarComponent } from './components/side-bar/side-bar.component'; 
//import { DxGridComponent } from './components/dxGrid/dxgrid.component';
import { DxDataGridModule } from 'devextreme-angular';
import { AuthGuardService } from './guards/auth.guard';
import { RouterModule } from '@angular/router';
import { AddNewGoalComponent } from './components/add-new-goal/add-new-goal.component';
import { SignOutComponent } from './components/sign-out/sign-out.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { EditGoalComponent } from './components/edit-goal/edit-goal.component';
import { DeleteGoalTaskComponent } from './components/delete-goal-task/delete-goal-task.component';
import { AddViewNotesComponent } from './components/add-view-notes/add-view-notes.component';
import { ReassignTaskComponent } from './components/reassign-task/reassign-task.component';
import { CompletedTasksComponent } from './components/completed-tasks/completed-tasks.component';
import { DueDatePipe } from './pipes/due-date.pipe';
import { ShortNamePipe } from './pipes/short-name.pipe';
import { UpdateVcfoComponent } from './components/update-vcfo/update-vcfo.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

import { GoalReorderComponent } from './components/goal-reorder/goal-reorder.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddAdvisorComponent } from './components/add-advisor/add-advisor.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import { OneDigitDecimaNumberDirective } from './directives/decimalValidator';



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        DxDataGridModule, 
        NgSelectModule,       
        BsDatepickerModule.forRoot(), 
        DragDropModule,
        TypeaheadModule.forRoot(),
        TypeaheadModule.forRoot()       
    ],
    declarations: [
        SafeHtmlPipe,
        BooleanConverterpipe,
        UpperCaseDirective,
        PhoneNumberDirective,
        ZipConverterDirective,
        FilterPipe,
        BooleanFilterPipe,
        HeaderComponent,
        SideBarComponent,
        AddNewGoalComponent,
        SignOutComponent,
        AddTaskComponent,
        EditGoalComponent,
        DeleteGoalTaskComponent,
        AddViewNotesComponent,
        ReassignTaskComponent,
        CompletedTasksComponent,
        DueDatePipe,
        ShortNamePipe,
        UpdateVcfoComponent,
        ConfirmModalComponent,
        GoalReorderComponent,
        AddAdvisorComponent,
        OneDigitDecimaNumberDirective
    ],
    exports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        UpperCaseDirective,
        PhoneNumberDirective,
        OneDigitDecimaNumberDirective,
        ZipConverterDirective,
        FilterPipe,
        BooleanFilterPipe,
        BooleanConverterpipe,
        DueDatePipe,
        ShortNamePipe,
        HeaderComponent,
        SideBarComponent,
        SignOutComponent
    
    ],
    entryComponents: [
        AddNewGoalComponent,
        AddTaskComponent,
        EditGoalComponent,
        DeleteGoalTaskComponent,
        AddViewNotesComponent,
        ReassignTaskComponent,
        CompletedTasksComponent,
        UpdateVcfoComponent,
        ConfirmModalComponent,       
        GoalReorderComponent,
        AddAdvisorComponent
    ],
    providers: [AuthGuardService]
})

export class SharedModule { }
