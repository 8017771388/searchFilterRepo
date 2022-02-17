import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CorePlanService } from '../../services/core-plan.service';
import { CommunicationService } from 'src/app/modules/_shared/services/communication.services';
import { ANALYST } from '../../../_shared/constants/global.constant';



@Component({
  selector: 'app-add-task-calendar',
  templateUrl: './add-task-calendar.component.html',
  styleUrls: ['./add-task-calendar.component.scss']
})
export class AddTaskCalendarComponent implements OnInit {

  public repId : string;
  public goals : any;
  public advisorInfo : any;
  public userName : string;
  public assignedTo : string = 'VCFO';
  public note : string;
  public goalInfo : any = "";
  public taskName : string;
  public dueDate : string;
  public  masterLibraryTask: any = [];
  public goalType : any;
  public tasksSelected : any = {};
  public multipleTask : any = {};
  public allTaskExist : boolean = false;
  public userType : any;
  public analyst : string = ANALYST;
  public taskExist : boolean = false;

  constructor(public bsModalRef: BsModalRef, private modalService: BsModalService, public corePlanService : CorePlanService, public communicationService : CommunicationService) { }

  @Output() addTaskResp = new EventEmitter();
  

  ngOnInit() {
    this.advisorInfo = {vcfoUsername : null};
    this.goalType = "Master";
    this.communicationService.getAccessType().subscribe( userType => this.userType = userType);
    this.getAllGoals(); 
    this.assignedTo = this.advisorInfo.vcfoUsername === null ? "Advisor" : "VCFO";       
  }
  

  hideTask() {
    this.bsModalRef.hide();
  }

  taskSelected(event){     
    //console.log(event);
    this.tasksSelected = event;   
  }

  getAllGoals(){
    if(this.repId){
      this.communicationService.displayLoader(true);
      let requestData = {
        repId : this.repId,
        status : ''
      };
      this.corePlanService.getActionPlan(requestData).subscribe((data : any) => {
        if(data.status.toLowerCase() == 'success'){
          this.advisorInfo = data.data.advisorInfo;
          this.goals = data.data.advisorInfo.goals;
          //this.communicationService.clearLoader(); 
          this.assignedTo = this.advisorInfo.vcfoUsername === null ? "Advisor" : "VCFO";        
        }
        this.communicationService.clearLoader();
      })
    }
  }

  goalSelected(goal){
    this.taskExist = false;
    this.goalInfo = goal;
    this.taskName = "";
    this.communicationService.displayLoader(true);
    this.getMaterLibraryTask(this.goalInfo);
  }

  getMaterLibraryTask(goalDetail){
   // this.communicationService.displayLoader(true);
    if(goalDetail.goalId != null){
      this.corePlanService.getTasks(goalDetail.goalId).subscribe(data => {
        this.masterLibraryTask =  data["data"];
        this.masterLibraryTask.forEach(taskMaster => {
          goalDetail.tasks.forEach(taskPresent => {
            if(taskMaster.task === taskPresent.task){
              this.masterLibraryTask = this.masterLibraryTask.filter(element => element.task != taskPresent.task);
              this.communicationService.clearLoader();
            }
          });
        });
          if (this.masterLibraryTask.length <= 0) {
              this.allTaskExist = true;
              this.communicationService.clearLoader();
          }
          else {
              this.communicationService.clearLoader();
          }
      })      
    }
    else{
      this.communicationService.clearLoader();
      this.masterLibraryTask = null;
      this.goalType = "";
    }
    this.communicationService.clearLoader();
    //console.log(this.masterLibraryTask);
  }

  checkDuplicateTask(taskEntered){    
      this.taskExist = false;
      this.goalInfo.tasks.forEach(element => {      
        if(element.task === taskEntered){          
            this.taskExist = true;       
        }        
      })    
  }

  addTask(){
    this.communicationService.displayLoader(true);
    var assignedTo = this.assignedTo == 'VCFO' ? this.advisorInfo.vcfoUsername : this.advisorInfo.repId;
    var notevisibilitylevel = (this.userType === this.analyst && this.note !== '') ? 1 : 0;
    if(this.goalType === 'Master'){      
      this.tasksSelected.forEach(element => {
        element.category= this.goalInfo.category,
        element.categoryId= this.goalInfo.categoryId,
        element.goal= this.goalInfo.goal,
        element.duedate= this.dueDate,
        element.VCFOorAdvisor= this.assignedTo
        element.assignedTo = assignedTo,
        element.status= 1,
        element.note= this.note,
        element.isActive= 1,
        element.goalId= this.goalInfo.goalId ,
        element.actionPlanId= null,
        element.username= this.userName,
        element.elapsedTime = "",
        element.noteVisibilityLevel = notevisibilitylevel
      });
      this.multipleTask.task =this.tasksSelected;
    }
    else{
      this.multipleTask.task=[];
      let reqParam = {        
            "category": this.goalInfo.category,
            "categoryId": this.goalInfo.categoryId,
            "goal": this.goalInfo.goal,
            "task": this.taskName,
            "duedate": this.dueDate,
            "VCFOorAdvisor": this.assignedTo,
            "assignedTo" : assignedTo,
            "status": 1,
            "note": this.note,
            "isActive": 1,
            "goalId": this.goalInfo.goalId,
            "actionPlanId": null,
            "username": this.userName,
            "elapsedTime": "",
            "noteVisibilityLevel": notevisibilitylevel                
      }
      this.multipleTask.task.push(reqParam);
    }
    this.multipleTask .repId  =  this.repId;
    this.multipleTask.username = this.userName;
    this.multipleTask.noteVisibilityLevel = notevisibilitylevel;

    this.corePlanService.modifyTask(this.multipleTask).subscribe((data:any) => {
      if(data.status.toLowerCase() == 'success'){
        this.addTaskResp.emit("true");
        this.bsModalRef.hide();
        this.communicationService.clearLoader();
      }
      else{
        this.communicationService.clearLoader();
      }
    })
    this.communicationService.clearLoader();
  }


}
