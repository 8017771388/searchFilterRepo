import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { UserInfo } from  '../../../_shared/services/userInfo.service';
import { CorePlanService } from '../../services/core-plan.service';
import { DatePipe } from '@angular/common';
import { CommunicationService } from '../../../_shared/services/communication.services';
import { GOAL_STATUS,TASK_STATUS, ANALYST } from '../../../_shared/constants/global.constant';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddNewGoalComponent } from '../../../_shared/components/add-new-goal/add-new-goal.component';
import { AddTaskComponent } from '../../../_shared/components/add-task/add-task.component';
import { EditGoalComponent } from 'src/app/modules/_shared/components/edit-goal/edit-goal.component';
import { DeleteGoalTaskComponent } from 'src/app/modules/_shared/components/delete-goal-task/delete-goal-task.component';
import { AddViewNotesComponent } from '../../../_shared/components/add-view-notes/add-view-notes.component';
import { ReassignTaskComponent } from '../../../_shared/components/reassign-task/reassign-task.component';
import { CompletedTasksComponent } from '../../../_shared/components/completed-tasks/completed-tasks.component';
import { GoalReorderComponent } from '../../../_shared/components/goal-reorder/goal-reorder.component';
import { Observable, Observer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-core-plan',
  templateUrl: './core-plan.component.html',
  styleUrls: ['./core-plan.component.scss'], 
  providers: [DatePipe]
})
export class CorePlanComponent implements OnInit {
  public goalConstant = GOAL_STATUS;
  public taskConstant = TASK_STATUS
  public bsModalRef : BsModalRef;
  public corePlanResponse : any = [];   
  public corePlanGoals : any = [];
  public currentUser: any;
  public requestData : any;
  public goalStatus : string = "";
  public showGoals : boolean = false;
  public repId :string;
  public advisorName : string;
  public expandedRow : number = -1;
  public advisor : any;
  public allAdvisors : any;
  public dataSource: Observable<any>;
  public noResult : boolean = false;
  public userType : any;
  public analyst : string = ANALYST;
  public currentView : string = 'T';
  addGoalObj: any;

  constructor(private corePlanService : CorePlanService, private userinfo : UserInfo, private communicationService : CommunicationService, private modalService : BsModalService, private datePipe : DatePipe, private route : ActivatedRoute, private router : Router, private orderPipe: OrderPipe) {
      this.repId = route.snapshot.paramMap.get("repid");
      this.advisorName = route.snapshot.paramMap.get("advisor");
      this.advisor = this.repId + " | " + this.advisorName;
  }
  public switchView: boolean = true;
  expandRow(index){
    this.expandedRow = index;
  }  
  
  typeaheadOnSelect(event: TypeaheadMatch): void {
    this.repId = event.item.repid;
    this.advisorName = event.item.name;   
    this.router.navigate(['home/core-plan/'+this.repId+'/'+this.advisorName]);
    this.getActionPlan("");
    
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  reorderGoal(){
    this.communicationService.getPlanData().subscribe(data => {
      this.addGoalObj = data;
      //this.addGoalObj = this.orderPipe.transform(this.addGoalObj, 'goals.goalOrder');
    });

    let initialState = {
      goalObj: this.addGoalObj,
      currentUser : this.currentUser,
      title: 'Rearrange Goal'
    };
    
    this.bsModalRef = this.modalService.show(GoalReorderComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.orderSaved.subscribe(value => {
      if(value){
        this.expandedRow = -1;
        this.getActionPlan("");
      }
    })
  }

  addNewGoal() {
    this.communicationService.getPlanData().subscribe(data => {
        this.addGoalObj = data;
    });

    let initialState = {
      actionPlanId: this.addGoalObj.actionplanId,
      currentUser : this.currentUser,
      title: 'Add New Goal'
    };

    this.bsModalRef = this.modalService.show(AddNewGoalComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.goalSaved.subscribe(value => {
      if(value){
        this.communicationService.displayLoader(true);
        this.expandedRow = -1;
        this.getActionPlan("");
        this.communicationService.clearLoader();
      }
    })
  }

  editGoal(goalDet, event) {
    event.stopPropagation();
    var ediGoalObj   
    this.communicationService.getPlanData().subscribe(data => {
      ediGoalObj = data;
    });

    let initialState = {
      actionPlanDet: ediGoalObj,
      goalDetail : goalDet,
      currentUser : this.currentUser,
      title: 'Edit Goal'
    };

    this.bsModalRef = this.modalService.show(EditGoalComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.goalEdited.subscribe(value => {
      if(value){
        this.expandedRow = -1;
        this.getActionPlan("");
      }
    })
  }

  
  deleteGoal(advisorDet, goalDet, event){
    event.stopPropagation();
    let initialState = {
      actionPlanDet: advisorDet,
      goalDetail : goalDet,
      currentUser : this.currentUser,
      title: 'Delete Goal'
    };

    this.bsModalRef = this.modalService.show(DeleteGoalTaskComponent, {initialState, backdrop: 'static'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.goalDeleted.subscribe(value => {
      if(value){
        this.expandedRow = -1;
        this.getActionPlan("");
      }
    })
  }  

  trackByFn(index, item) {
    return index;
  }

  addTask(advisorDet, goalDet, index) {
    this.expandedRow = index;
    let initialState = {
      currentUser : this.currentUser,
      advisorDetail : advisorDet,
      goalDetail : goalDet,
      userType: this.userType,
      title: 'Add Task',      
      openFrom : 'core-plan'
    };

    this.bsModalRef = this.modalService.show(AddTaskComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.taskSaved.subscribe(value => {
      if(value){
        this.getActionPlan("");
      }
    })
  }

  editTask(taskDet, goalDet, index){
    this.expandedRow = index;
    var advisorDet;
    this.communicationService.getPlanData().subscribe(data => {
      advisorDet = data;
    });
    
    let initialState = {
      currentUser : this.currentUser,
      taskData: taskDet,
      goalDetail : goalDet,
      advisorDetail : advisorDet,      
      userType: this.userType,
      title: 'Edit Task',
      openFrom : 'core-plan'
    };
    ////console.log(initialState);
    this.bsModalRef = this.modalService.show(AddTaskComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.taskSaved.subscribe(value => {
      if(value){
        this.getActionPlan("");
      }
    })
  }

  deleteTask(advisorDet, taskdet, index){
    this.expandedRow = index;
    let initialState = {
      actionPlanDet: advisorDet,
      goalDetail : taskdet,
      currentUser : this.currentUser,
      title: 'Delete Task'
    };

    this.bsModalRef = this.modalService.show(DeleteGoalTaskComponent, {initialState, backdrop: 'static'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.goalDeleted.subscribe(value => {
      if(value){
        this.getActionPlan("");
      }
    })
  }

  markAsComplete(actionPlanDetId, index){
    this.expandedRow = index;
    var reqParam = { 
      actionPlanDetailId: actionPlanDetId, 
      username: this.currentUser.userName 
    };

    this.corePlanService.completeTask(reqParam).subscribe(response =>{
      if(response){
        this.getActionPlan("");
      }
    })
  }

  addNotes(taskDet, goalDet, index){
    this.expandedRow = index;
    var noteObj;
    this.communicationService.getPlanData().subscribe(data => {
      noteObj = data;
    });
    
    let initialState = {
      taskDetail: taskDet,
      goalDetail : goalDet,
      repId : noteObj.repId,
      currentUser : this.currentUser,
      title: 'View/Add Task Notes',
      userType: this.userType,
    };
    
    this.bsModalRef = this.modalService.show(AddViewNotesComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.notesChanged.subscribe(value => {
      if(value){
        this.getActionPlan("");
      }
    })
  }

  reassignTask(taskDet, goalDet, index){
    this.expandedRow = index;
    var taskObj : any;
    this.communicationService.getPlanData().subscribe(data => {
      taskObj = data.actionplanId;
    });
    let initialState = {
      taskDetail: taskDet,
      goalDetail : goalDet,
      currentUser : this.currentUser,
      actionplanId: taskObj,
      userType : this.userType,
      title: 'Reassign Task'
    };

    this.bsModalRef = this.modalService.show(ReassignTaskComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.taskReassigned.subscribe(value => {
      if(value){
        this.getActionPlan("");
      }
    })
  }

  completedTasks(goalDet){
    var taskObj : any =[];
    this.communicationService.getPlanData().subscribe(data => {
      taskObj.actionplanId = data.actionplanId;
      taskObj.vcfo = data.vcfo;
      taskObj.advisorName = data.advisorName;
      taskObj.repId = data.repId;
    });
    let initialState = {
      actionPlanDet: taskObj,
      goalDetail : goalDet,
      currentUser : this.currentUser,
      title: 'Completed Tasks'
    };

    this.bsModalRef = this.modalService.show(CompletedTasksComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';    
  }

  //Service Call

  getActionPlan(goalstat){
    this.communicationService.displayLoader(true);
    this.goalStatus = goalstat
    this.requestData = {
      repId : this.repId,
      status : this.goalStatus
    };
    this.corePlanService.getActionPlan(this.requestData).subscribe(data => {
      if(data){
        this.corePlanResponse = data;
        var arrayToBesorted= this.corePlanResponse.data.advisorInfo;
        this.corePlanGoals = this.orderPipe.transform(arrayToBesorted, 'goals.goalOrder');
        //this.communicationService.setPlanData(data);
        this.communicationService.setPlanData(this.corePlanGoals);

        if(this.corePlanGoals.goals.length > 0){
          this.showGoals = true;          
        }
        else{
          this.showGoals = false;   
        }

        if(this.expandedRow !== -1) {
          this.corePlanGoals.goals[this.expandedRow].visibleTask = !this.corePlanGoals.goals[this.expandedRow].visibleTask 
        }   
        this.communicationService.clearLoader();         
      }
      this.communicationService.clearLoader();
    })
  }

  ngOnInit() {  
    this.communicationService.getAccessType().subscribe( userType => this.userType = userType);     
    this.dataSource = Observable.create((observer: Observer<string>) => observer.next(this.advisor))
    .pipe(mergeMap((token: string) => this.corePlanService.searchAdvisor(token)));
    this.communicationService.displayLoader(true);
    this.currentUser = this.userinfo._currentUserFn(); 
    this.getActionPlan("");
  }
  switchViewFunc(currView){
    if(this.currentView != currView){     
        this.currentView = currView;
        this.switchView = !this.switchView;
    }    
    if(currView == 'T'){
      this.getActionPlan("");
    }
     
  }

}
