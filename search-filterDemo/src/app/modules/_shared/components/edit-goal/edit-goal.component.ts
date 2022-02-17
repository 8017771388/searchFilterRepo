import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CorePlanService } from  '../../../home/services/core-plan.service';
import { CommunicationService } from '../../../_shared/services/communication.services';

@Component({
  selector: 'app-edit-goal',
  templateUrl: './edit-goal.component.html',
  styleUrls: ['./edit-goal.component.scss']
})
export class EditGoalComponent implements OnInit {
  @Output() goalEdited  = new EventEmitter();

  public actionPlanDet : any;
  public goalDetail : any;
  public currentUser : any;
  public title : any;
  public goalDetails: any;
  public quarters : any = ["Q1", "Q2", "Q3", "Q4"];
  public completionYear : any = [];
  public today: any = new Date();
  public currentQuarterIndex : number;
  public quarterYear : any = this.today.getFullYear();
  public currentQuarter : any;
  public noYearSelected : boolean = false;
  public noQuarterSelected : boolean = false;

  constructor(private cs : CorePlanService, public bsModalRef: BsModalRef, private comService : CommunicationService) { 
    var currentYear = this.today.getFullYear();
    var currentMonth = this.today.getMonth();
    for(var i=0; i<=10; i++){
      this.completionYear.push(currentYear + i);
    } 
    if(currentMonth >= 0 && currentMonth <= 2){
      this.currentQuarterIndex = 0;
      this.currentQuarter = 'Q1';
    }
    else if(currentMonth >= 3 && currentMonth <= 5){
      this.currentQuarterIndex = 1;
      this.currentQuarter = 'Q2';
    } 
    else if(currentMonth >= 6 && currentMonth <= 8){
      this.currentQuarterIndex = 2;
      this.currentQuarter = 'Q3';
    }
    else if(currentMonth >= 9 && currentMonth <= 11){
      this.currentQuarterIndex = 3;
      this.currentQuarter = 'Q4';
    }
  }

  getQuarterYear(event){
    this.noYearSelected = false;
    this.noQuarterSelected = false;
    this.quarterYear = event;
    // if(event === this.today.getFullYear() && this.goalDetails.goalDueQuarter !== this.currentQuarter){
    //   this.goalDetails.goalDueQuarter='';
    // }
    if(this.goalDetails.goalDueQuarter === ""){
      this.noQuarterSelected = true;
    }
    else{
      this.noQuarterSelected = false;
    }
  }

  getQuarter(event){
    this.noYearSelected = false;
    this.noQuarterSelected = false;
    if(this.goalDetails.goalDueQuarterYr === "" ){
      this.noYearSelected = true;
    }
    else{
      this.noYearSelected = false;
    }
  }

  updateGoal(){
    this.comService.displayLoader(true);
    var editGoalObj = {
      actionPlanDetailId: 0,
      actionPlanId: this.actionPlanDet.actionplanId,
      category: this.goalDetail.category,
      categoryId: this.goalDetail.categoryId,
      goal: this.goalDetail.goal,
      goalDescription: this.goalDetails.goalDescription,
      goalId: this.goalDetail.goalId,
      isActive: 1,
      goalDueQuarter: this.goalDetails.goalDueQuarter === "" ? null : this.goalDetails.goalDueQuarter,
      goalDueQuarterYr: this.goalDetails.goalDueQuarterYr === "" ? null : this.goalDetails.goalDueQuarterYr,
      username: this.currentUser.username    
    }
    this.cs.updateActionPlanGoal(editGoalObj).subscribe(data=> {
      this.goalEdited.emit("true");
      this.bsModalRef.hide();
      this.comService.clearLoader();
    })
    this.comService.clearLoader();
  }  

  ngOnInit() {
    this.goalDetails = Object.assign({}, this.goalDetail);
    this.goalDetails.goalDueQuarter = this.goalDetails.goalDueQuarter === null ? "" : this.goalDetails.goalDueQuarter;
    this.goalDetails.goalDueQuarterYr = this.goalDetails.goalDueQuarterYr === null ? "" : this.goalDetails.goalDueQuarterYr;
  }

}
