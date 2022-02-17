import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CorePlanService } from  '../../../home/services/core-plan.service';
import { DatePipe } from '@angular/common';
import { ANALYST } from '../../constants/global.constant';

@Component({
  selector: 'app-reassign-task',
  templateUrl: './reassign-task.component.html',
  styleUrls: ['./reassign-task.component.scss'],   
  providers : [CorePlanService, DatePipe]
})
export class ReassignTaskComponent implements OnInit {

  @Output() taskReassigned = new EventEmitter();

  public title : any;
  public taskDetails : any;
  public goalDetails : any;
  public taskDetail : any;
  public goalDetail : any;
  public currentUser : any;
  public actionplanId : any;
  public allVCFO : any = {};
  public allVCFOs : any;
  public assignedTo : any;
  public selectedCfo : any ="";
  public selectedAnalyst : any =""
  public userType : any;
  public analyst : string = ANALYST;
  public allAnalysts : any;
  public maxDate : any;
  public taskExist : boolean = false;
  public clickOnce : boolean = false;

  constructor(public bsModalRef: BsModalRef, private cs : CorePlanService, private datePipe : DatePipe) { }

  cfoSelected(event, cfo){    
    this.taskDetails.owner = event;
  }
  analystSelected(event){    
    //console.log(event);
    if(event !== ""){
      this.taskDetails.internalAssignTo = event;
      this.allAnalysts.forEach(element => {
        if(element.username === event){
          this.taskDetails.internalOwnerName = element.fullname;
        }
      });
    }
    else{
      this.taskDetails.internalAssignTo = null;
      this.taskDetails.internalOwnerName = null;
    }
    
  }

  onDateChange(event) {
    // let format = 'MMM d, yyyy';
  
    // this.taskDetails.dueDate = this.datePipe.transform(event, format);
    this.maxDate = new Date(this.taskDetails.dueDate);
    this.maxDate.setDate(this.maxDate.getDate() - 1); 
    //console.log(event);
  }

  onValueChange(date, type) {
    let format = 'MMM d, yyyy'; 
    if(type === 'owner'){
      this.taskDetails.duedate = new Date(this.taskDetails.dueDate);
      this.taskDetails.duedate = this.datePipe.transform(date, format); 
    }
    else{
      this.taskDetails.internalDuedate = new Date(this.taskDetails.internalDueDate);
      this.taskDetails.internalDuedate = this.datePipe.transform(date, format);
    }    
  }

  checkDuplicateTask(taskEntered){    
    this.taskExist = false;  
    this.goalDetail.tasks.forEach(element => {      
      if(element.task === taskEntered){         
        if(this.taskDetail.task == taskEntered)
          this.taskExist = false;  
        else
          this.taskExist = true;   
      }
    }) 
  }

  reassignTask(){
    this.onValueChange(this.taskDetail.dueDate, 'owner');
    this.onValueChange(this.taskDetails.internalDueDate, 'internal');
    var param = {
      "actionPlanDetailId": this.taskDetails.actionPlanDetailId,
      "task": this.taskDetails.task,
      "assignedTo": this.taskDetails.owner,
      "duedate": this.taskDetails.duedate ? this.taskDetails.duedate : null,
      "goal": this.goalDetails.goal,
      "goalId": this.goalDetails.goalId,
      "categoryId": this.goalDetails.categoryId,
      "category": this.goalDetails.category,
      "isActive": "1",
      "username": this.taskDetails.owner,
      "goalDescription":this.goalDetails.goalDescription,
      "note": this.taskDetails.note ? this.taskDetails.note : '',
      "vcfoOrAdvisor":this.taskDetails.vcfoOrAdvisor,
      "internalAssignTo": this.taskDetails.internalAssignTo,
      "internalDueDate": this.taskDetails.internalDuedate,
        "internalOwnerName": this.taskDetails.internalOwnerName,
        "internalStatus": this.taskDetails.internalStatusCode
        
    };
    //console.log(param);

    this.cs.editTask(param).subscribe(data => {
      //console.log(data);
      this.taskReassigned.emit("true");
      this.bsModalRef.hide();
    })
  }

  ngOnInit() {
    this.goalDetails = Object.assign({}, this.goalDetail);
    this.taskDetails = Object.assign({}, this.taskDetail);
    //console.log(this.taskDetails);
    this.taskDetails.dueDate = new Date(this.taskDetail.dueDate);
    this.maxDate = new Date(this.taskDetails.dueDate);
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    if(this.taskDetails.internalDueDate !== null){
      this.taskDetails.internalDueDate = new Date(this.taskDetail.internalDueDate);
    }
    this.selectedCfo = this.taskDetails.owner;
    this.selectedAnalyst =  this.taskDetails.internalAssignTo !== null ? this.taskDetails.internalAssignTo : "";

    this.cs.getAllVcfos('').subscribe(response => {      
      this.allVCFO = response;
      this.allVCFOs = this.allVCFO.data;
    })

    this.cs.getAllAnalysts().subscribe(response => {
      this.allAnalysts = response["data"];
      //console.log(this.allAnalysts)
    })
  }

}
