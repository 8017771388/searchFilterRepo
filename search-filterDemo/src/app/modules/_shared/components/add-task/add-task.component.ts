import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { CorePlanService } from  '../../../home/services/core-plan.service';
import { CommunicationService } from '../../../_shared/services/communication.services';
import { ANALYST } from '../../constants/global.constant';
import * as moment from 'moment';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],   
  providers : [CorePlanService, DatePipe]
})
export class AddTaskComponent implements OnInit {
  @Output() taskSaved = new EventEmitter();  
  @Output() taskSavedHome = new EventEmitter();
   
  public tasks : any = {
    "taskName": '',
    "assignedTo": "",
    "dueDate": "",
    "notes": "",
    "timeSpent" : "",
    "internalDueDate":"",
    "selectedInternalStatus" : ""
  };
  public title : any;
  public goalType : any;
  public advisorDetail : any;
  public goalDetail : any;
  public currentUser : any;
  masterLibraryTask: any;
  public masterLibrary : any;
  public multipleTask : any = {};
  public tasksSelected : any = {};
  public repId : any = null;
  public cfoName : any = null;
  public cfoUserName : any = null;
  public openFrom : any = 'core-plan';
  public isNewGoal : boolean = false;
  public taskData : any = null;
  public isEdit : boolean = false;
  public editDate : any;
  public editInternalDate : any;
  public allTaskExist : boolean = false;
  public taskExist : boolean = false;
  public clickOnce : boolean = false;
  public userType : any;
  public analyst : string = ANALYST;
  public allInternalStatus : any;
  public maxDate : any;
  public advDetGoals : any;
  public type : any;
  //public selectedInternalStatus : any = "";

  constructor(public bsModalRef: BsModalRef, private cs : CorePlanService, private datePipe : DatePipe, private commService : CommunicationService) { }

  onValueChange(event, dateType) {
    let format = 'MMM d, yyyy';
    if(dateType === 'duedate'){
      this.tasks.dueDate = this.datePipe.transform(event, format);
      this.maxDate = new Date(this.tasks.dueDate);
      this.maxDate.setDate(this.maxDate.getDate() - 1); 
    }   
    else{
      ////console.log(event);
      if(event == 'Invalid Date')
        event = '';
      this.tasks.internalDueDate = this.datePipe.transform(event, format); 
    }
  }

  taskSelected(event){     
    this.tasksSelected = event;    
  }

  formatTime(event){ 
    if(event.length === 2){      
      this.tasks.timeSpent = this.tasks.timeSpent + ":";             
    } 
    if(event.length === 5){
      if(event.split(":")[0] === "24" && event.split(":")[1] > "00"){
        this.tasks.timeSpent = "24" + ":"; 
      }
    }   
  }

  checkValue(event){
    let value = event.target.value.replace(":","");
    if(event.target.value.length === 4 || event.target.value.length === 3){
      let checkColon = event.target.value.slice(-1);
      if(checkColon !== ":"){
        value =value.slice(0,2)+":"+value.slice(2,3);
        this.tasks.timeSpent = value;
      }
    }
    if(value.length == 2 ){
      if(value > 24 && event.keyCode != 8){
        return false;
      }
    }
    else if(value.length > 2 ){
      let minutes = value.slice(-1);
      if(minutes > 5 && event.keyCode != 8){
        return false;
      }
    }
  }

  checkDuplicateTask(taskEntered){
    if(this.openFrom !== 'home-page'){
      this.taskExist = false;
      if(this.type === 'calendar'){
        this.advDetGoals.forEach(element => {
          if(element.goal == this.goalDetail.goal){
            element.tasks.forEach(task => {
              if(task.task === taskEntered){
                this.taskExist = true;
              }
            });
          }
        });
      }
      else{
        this.goalDetail.tasks.forEach(element => {      
          if(element.task === taskEntered){
            if(this.isEdit && this.taskData.task == element.task)
              this.taskExist = false;  
            else
              this.taskExist = true;       
          }
        }) 
      }
      
    }
    
  }

  editTask(){
      this.commService.displayLoader(true);
      var notevisibilitylevel = (this.userType === this.analyst && this.tasks.note !== '') ? 1 : 0; 
    var internalStatus = this.tasks.selectedInternalStatus === 'COMP' ? this.currentUser.userName : null;
    var assignedTo = this.tasks.assignedTo == 'VCFO' ? (this.taskData.owner == this.advisorDetail.repId ? this.advisorDetail.vcfoUsername : this.taskData.owner) :this.advisorDetail.repId;
    var editTaskObj = {
      actionPlanDetailId : this.taskData.actionPlanDetailId,
      category: this.taskData.category,
      categoryId: this.taskData.categoryId,
      goal: this.goalDetail.goal,
      goalDescription: this.goalDetail.goalDescription,
      task: this.tasks.taskName,
      duedate: this.tasks.dueDate,
      vcfoOrAdvisor: this.tasks.assignedTo,
      assignedTo: assignedTo,
      note: this.tasks.notes,
      isActive: 1,
      goalId: this.goalDetail.goalId,
      username: this.currentUser.userName,
      elapsedtime : this.tasks.timeSpent,
      internalDueDate : this.tasks.internalDueDate,
        internalCompletedBy: internalStatus,
        internalStatus: this.tasks.selectedInternalStatus,
        internalAssignTo: this.tasks.internalAssignTo,
        noteVisibilityLevel: notevisibilitylevel
    };

    this.cs.editTask(editTaskObj).subscribe(data => {
      this.taskSaved.emit("true");
      this.bsModalRef.hide();
      this.commService.clearLoader();
    })
    this.commService.clearLoader();
  }

  editHomeTask(){
    //var assignedTo = this.tasks.assignedTo == 'VCFO' ? (this.taskData.owner == this.advisorDetail.repId ? this.advisorDetail.vcfoUsername : this.taskData.owner) :this.advisorDetail.repId;
      var internalStatus = this.tasks.selectedInternalStatus === 'COMP' ? this.currentUser.userName : null;
      var notevisibilitylevel = (this.userType === this.analyst && this.tasks.note !== '') ? 1 : 0; 
    var editTaskObj = {
        actionPlanDetailId: this.taskData.ActionPlanDetailId,
        actionPlanId: this.taskData.actionPlanId,
      category: this.taskData.category,
      categoryId: this.taskData.categoryId,
        goal: this.taskData.goal,
        //goalDescription: this.taskData.goalDescription,
      task: this.tasks.taskName,
      duedate: this.tasks.dueDate,
        vcfoOrAdvisor: this.tasks.assignedTo,
        assignedTo: this.taskData.assignedTo,
      note: this.tasks.notes,
      isActive: 1,
      goalId: this.goalDetail.goalId,
      username: this.currentUser.userName,
      elapsedtime : this.tasks.timeSpent,
      internalDueDate : this.tasks.internalDueDate,
        internalCompletedBy: internalStatus,
        internalStatus: this.tasks.selectedInternalStatus,
        internalAssignTo: this.tasks.internalAssignTo,
        noteVisibilityLevel: notevisibilitylevel
    };
    //console.log(editTaskObj);

    this.cs.editTask(editTaskObj).subscribe(data => {
      this.taskSavedHome.emit({status:true, data: editTaskObj});
      this.bsModalRef.hide();
    })
  }

  saveTask(){
    this.commService.displayLoader(true);
    var assignedTo = this.tasks.assignedTo == 'VCFO' ? this.advisorDetail.vcfoUsername : this.advisorDetail.repId;
    var notevisibilitylevel = (this.userType === this.analyst && this.tasks.note !== '') ? 1 : 0; 

    if(this.goalType === 'Master'){      
      this.tasksSelected.forEach(element => {
        element.category= this.goalDetail.category,
        element.categoryId= this.goalDetail.categoryId,
        element.goal= this.goalDetail.goal,
        element.duedate= this.tasks.dueDate,
        element.VCFOorAdvisor= this.tasks.assignedTo,
        element.assignedTo= assignedTo,
        element.status= 1,
        element.note= this.tasks.notes,
        element.isActive= 1,
        element.goalId= this.goalDetail.goalId ,
        element.actionPlanId= this.advisorDetail.actionplanId,
        element.username= this.currentUser.userName,
        element.elapsedTime = this.tasks.timeSpent,
        element.noteVisibilityLevel = notevisibilitylevel
      });
      this.multipleTask.task =this.tasksSelected;
    }
    else{
      this.multipleTask.task=[];
      var newTask = {
        category: this.goalDetail.category,
        categoryId: this.goalDetail.categoryId,
        goal: this.goalDetail.goal,
        task: this.tasks.taskName,
        duedate: this.tasks.dueDate,
        VCFOorAdvisor: this.tasks.assignedTo,
        assignedTo: assignedTo,
        status: 1,
        note: this.tasks.notes,
        isActive: 1,
        goalId: this.goalDetail.goalId ,
        actionPlanId: this.advisorDetail.actionplanId,
        username: this.currentUser.userName,
        elapsedTime : this.tasks.timeSpent,
        noteVisibilityLevel : notevisibilitylevel
      };
      this.multipleTask.task.push(newTask);
    }    

    this.multipleTask.repId = this.advisorDetail.repId;
    this.multipleTask.username = this.currentUser.userName;
    this.multipleTask.noteVisibilityLevel = notevisibilitylevel; 

    
    this.cs.modifyTask(this.multipleTask).subscribe(data => {
      if(data){
        this.taskSaved.emit("true");
        this.bsModalRef.hide();
        this.commService.clearLoader();
      }
      else{
        this.commService.clearLoader();
      }
    })
    this.commService.clearLoader();
  }

  addTask(){
   // console.log('addTask', this.tasks.dueDate);
    var internalStatus = this.tasks.selectedInternalStatus === 'COMP' ? this.currentUser.userName : null;
    var notevisibilitylevel = (this.userType === this.analyst && this.tasks.note !== '') ? 1 : 0; 
    var newTask = {
        // "category": vm.page.category.category ? vm.page.category.category : null,
        // "categoryId": vm.page.category.categoryid ? vm.page.category.categoryid : null,
        // "goal": vm.page.taskDetails.goal ? vm.page.taskDetails.goal : null,
        "task": this.tasks.taskName ? this.tasks.taskName : '',
        "duedate": this.tasks.dueDate ? this.tasks.dueDate : null,
        "VCFOorAdvisor": this.tasks.assignedTo,
        "assignedTo": this.tasks.assignedTo == 'VCFO' ? this.cfoUserName : this.repId,
        // "status": 1,
        "note": this.tasks.notes ? this.tasks.notes : null,
        "elapsedTime" : this.tasks.timeSpent,
        "internalDueDate" : this.tasks.internalDueDate,
        "internalStatus" : this.tasks.selectedInternalStatus,
        "internalCompletedBy": internalStatus,
        "noteVisibilityLevel": notevisibilitylevel,
        "internalAssignTo": this.tasks.internalAssignTo,
        // "isActive": 1,
        // "goalId": vm.page.taskDetails.goalId ? vm.page.taskDetails.goalId : ''
    };
    //console.log(newTask);
    this.taskSaved.emit(newTask);
    this.bsModalRef.hide();
  }

  getMaterLibraryTask(){
    this.commService.displayLoader(true);
    if(this.goalDetail.goalId != null){
      this.cs.getTasks(this.goalDetail.goalId).subscribe(data => {
        this.masterLibraryTask =  data;
        this.masterLibrary =  this.masterLibraryTask.data;
        this.masterLibrary.forEach(taskMaster => {
          this.goalDetail.tasks.forEach(taskPresent => {
            if(taskMaster.task === taskPresent.task){
              this.masterLibrary = this.masterLibrary.filter(element => element.task != taskPresent.task);
              this.commService.clearLoader();
            }
          });
        });
          if (this.masterLibrary.length <= 0) {
              this.allTaskExist = true;
              this.commService.clearLoader();
          }
          else {
              this.commService.clearLoader();
          }
      })      
    }
    else{
      this.commService.clearLoader();
      this.masterLibraryTask = null;
      this.goalType = "";
    }
    this.commService.clearLoader();
  }

  ngOnInit() {
    this.goalType = "Master";    

    if(this.title === 'Edit Task'){
      this.cs.getInternalStatus("Internalstatus").subscribe(response => {
        this.allInternalStatus = response["data"];
        //console.log(this.allInternalStatus);
      })
    }
       
    if(this.openFrom === 'core-plan'){
      if(this.title === 'Edit Task'){
        if(this.type === 'calendar'){
          var requestData = {
            repId : this.goalDetail.repId,
            status : ""
          };
          this.cs.getActionPlan(requestData).subscribe(data => {
            if(data){
              var res = data["data"]
              this.advDetGoals = res.advisorInfo.goals;
            }
          });
        }       
        if(this.taskData.task){
          if(this.taskData.dueDate !== null){            
            this.editDate = new Date(this.taskData.dueDate);            
            this.maxDate = new Date(this.taskData.dueDate);
            this.maxDate.setDate(this.maxDate.getDate() - 1);
          }
          else{
            this.editDate = this.taskData.dueDate;
          }
          this.editInternalDate = this.taskData.internalDueDate !== null ? new Date(this.taskData.internalDueDate) : this.taskData.internalDueDate;
          this.tasks.taskName = this.taskData.task;
          this.tasks.dueDate = this.taskData.duedate;
          this.tasks.assignedTo = this.taskData.vcfoOrAdvisor;
          //this.tasks.notes = this.taskData.note ? this.taskData.note : null;
          this.tasks.timeSpent =  this.taskData.elapsedTime;
            this.tasks.selectedInternalStatus = this.taskData.internalStatusCode !== null ? this.taskData.internalStatusCode : "";
            this.tasks.internalAssignTo = this.taskData.internalAssignTo;
        }
        this.isEdit = true;
      }
      else{
        this.getMaterLibraryTask();
        //console.log(this.advisorDetail);
        this.tasks.assignedTo = this.advisorDetail.vcfoUsername === null ? "Advisor" : "VCFO";
      }
    }    
    //console.log(this.openFrom);
    if(this.openFrom == 'build-core-plan'){
      this.tasks.assignedTo = 'VCFO';

      this.getMaterLibraryTask();
      
      if (!this.goalDetail.goalId || !Number.isInteger(this.goalDetail.goalId)) {
        this.isNewGoal = true;
      }
      this.tasks.assignedTo = 'Advisor';
     // console.log(this.taskData);
      if(this.title == 'Edit Task'){
        if(this.taskData.task){
          if(this.taskData.duedate !== null){
            this.editDate = new Date(this.taskData.duedate);
            this.maxDate = new Date(this.taskData.dueDate);
            this.maxDate.setDate(this.maxDate.getDate() - 1);
          }
          else{
            this.editDate = this.taskData.duedate;
          }
          this.tasks.taskName = this.taskData.task;
          this.tasks.dueDate = this.taskData.duedate;          
          this.tasks.assignedTo = this.taskData.VCFOorAdvisor;
          this.tasks.notes = this.taskData.note ? this.taskData.note : null;
          this.goalType = "";
          this.tasks.timeSpent = this.taskData.elapsedTime;
          this.editInternalDate = (this.taskData.internalDueDate !== null &&  this.taskData.internalDueDate !== "")? new Date(this.taskData.internalDueDate) : this.taskData.internalDueDate;
            this.tasks.selectedInternalStatus = (this.taskData.internalStatus !== null && this.taskData.internalStatus !== "") ? this.taskData.internalStatus : "";
            this.tasks.internalAssignTo = this.taskData.internalAssignTo;
        }
        this.isEdit = true;
        ////console.log(this.tasks);
      }
      
    }

    if(this.openFrom === 'home-page'){
      this.tasks.assignedTo = this.taskData.owner === 'CFO' ? 'VCFO' : 'Advisor';
      //console.log(this.taskData);
      if(this.taskData.task){
        if(this.taskData.duedate !== null && this.taskData.duedate !== "Not Assigned"){
          this.editDate = new Date(this.taskData.duedate);
          this.maxDate = new Date(this.taskData.dueDate);
          this.maxDate.setDate(this.maxDate.getDate() - 1);
        }
        else{
          //this.editDate = this.taskData.duedate;
          this.editDate = null;
        }
        this.editInternalDate = this.taskData.internalDueDate !== null ? new Date(this.taskData.internalDueDate) : this.taskData.internalDueDate;
        this.tasks.taskName = this.taskData.task;
        this.tasks.dueDate = this.taskData.duedate;
        this.tasks.timeSpent = this.taskData.elapsedTime;
        this.tasks.selectedInternalStatus = this.taskData.internalStatusCode !== null ? this.taskData.internalStatusCode : "";
        //this.tasks.notes = this.taskData.note ? this.taskData.note : null;
          this.tasks.internalAssignTo = this.taskData.internalAssignTo;
      }
      this.isEdit = true;
    }
   
  }

}
