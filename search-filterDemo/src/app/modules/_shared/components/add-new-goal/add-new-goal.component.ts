import { Component, OnInit, NgModule, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CorePlanService } from  '../../../home/services/core-plan.service';
import { CommunicationService } from '../../../_shared/services/communication.services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-new-goal',
  templateUrl: './add-new-goal.component.html',
  styleUrls: ['./add-new-goal.component.scss'],
  providers : [CorePlanService, DatePipe]
})
export class AddNewGoalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private cs : CorePlanService, private communicationService: CommunicationService, private date : DatePipe) {
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
  @Output() goalSaved = new EventEmitter();

  public actionPlanId : any;
  public currentUser : any;
  public title : any;
  public masterLibrarydata : any = {};
  public masterLibrary : any = [];
  public categoryGoals : any = [];
  public goals : any = [];
  public selectedCategory : any ="";
  public goalType : any;
  public customGoal : any ="";
  public selectedGoal : any = "";
  public openFrom : any;
  public goalName : any;
  public goalExist : boolean = false;
  public quarters : any = ["Q1", "Q2", "Q3", "Q4"];
  public completionYear : any = [];
  public today: any = new Date();
  public selectedQuarter : any = "";
  public quarterYear : any = "";
  public currentQuarterIndex : number;
  public currentYear : any = this.today.getFullYear();
  public currentQuarter : any;
  public noYearSelected : boolean = false;
  public noQuarterSelected : boolean = false;

  getYear(event){
    this.noYearSelected = false;
    this.noQuarterSelected = false;
    this.currentYear = event;
    // if(event === this.today.getFullYear() && this.selectedQuarter !== this.currentQuarter){
    //   this.selectedQuarter='';
    // }
    if(this.selectedQuarter === ""){
      this.noQuarterSelected = true;
    }
    else{
      this.noQuarterSelected = false;
    }
  }
  getQuarter(event){
    this.noYearSelected = false;
    this.noQuarterSelected = false;
    if(this.quarterYear === "" ){
      this.noYearSelected = true;
    }
    else{
      this.noYearSelected = false;
    }
  }

  renderGoals(event){
    this.categoryGoals = event;
    this.goalExist = false;
  }
  getSelectedGoal(event){
    this.goalExist = false;
    this.goals = event;
    this.duplicateGoal(this.goals.goal, this.categoryGoals.category);
  }

  getCustomGoal(event){
    this.goalExist = false;
    this.duplicateGoal(event, this.categoryGoals.category);
  }

  duplicateGoal(goal, category){
    var addGoalObj : any;
    this.communicationService.getPlanData().subscribe(data => {
      addGoalObj = data.goals;
    });

    addGoalObj.forEach(element => {
      if(element.goal === goal && element.category === category){
        this.goalExist = true;
      }      
    });
    
  }

  addGoal(){    
    this.communicationService.displayLoader(true);
    this.goalSaved.emit(this.goalName);
    this.bsModalRef.hide();
    this.communicationService.clearLoader();
  }

  saveGoal(){
    this.communicationService.displayLoader(true);
    var goal, goalId;
    if(this.goalType === 'Master'){
        goal = this.goals.goal;
        goalId = this.goals.goalId;
        
    }else{
        goal = this.customGoal;
        goalId = null;
    }  

    if(this.goalExist === false){
      var goalRequest = {
          actionPlanId: this.actionPlanId,
          actionPlanDetailId: '0',
          category: this.categoryGoals.category,
          categoryId: this.categoryGoals.categoryid, 
          goalId: goalId,
          goal: goal,
          goalDescription: null,
          isActive: 1,
          goalDueQuarter: this.selectedQuarter === "" ? null: this.selectedQuarter,
          goalDueQuarterYr: this.quarterYear === "" ? null : this.quarterYear ,
          username: this.currentUser.userName
      };
      //console.log(goalRequest);
      
      this.cs.updateActionPlanGoal(goalRequest).subscribe(data=> {
        //console.log(data);
        this.goalSaved.emit("true");
        this.bsModalRef.hide();
        this.communicationService.clearLoader();
      })
    }
  }

  ngOnInit() {   
    this.goalType = "Master";

    this.cs.getCategoryGoalsList().subscribe(data => {
      this.communicationService.displayLoader(true);
      this.masterLibrarydata =  data;
      this.masterLibrary =  this.masterLibrarydata.data.masterlibrary;
      this.communicationService.clearLoader();
    })
    
  }

}
