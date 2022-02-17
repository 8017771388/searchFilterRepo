import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CorePlanService } from  '../../../home/services/core-plan.service';
import { DatePipe } from '@angular/common';
import { CommunicationService } from '../../../_shared/services/communication.services';
import { GOAL_STATUS } from '../../../_shared/constants/global.constant';
import { TASK_STATUS } from '../../../_shared/constants/global.constant';

@Component({
  selector: 'app-completed-tasks',
  templateUrl: './completed-tasks.component.html',
  styleUrls: ['./completed-tasks.component.scss'],
  providers: [CorePlanService, DatePipe]
})
export class CompletedTasksComponent implements OnInit {
    public goalConstant = GOAL_STATUS;
  public actionPlanDet : any;
  public goalDetail : any;
  public currentUser : any;
  public title : any;
  public completedTask : any;
  public getAllNotesRes: any;
  public allNotes: any;

  constructor(public bsModalRef: BsModalRef, private cs : CorePlanService, private datePipe : DatePipe, private comService : CommunicationService) { }

  getCompletedTask(){
    this.comService.displayLoader(true);
    var request = {actionPlanId : this.actionPlanDet.actionplanId, goal: this.goalDetail.goal, goalId: this.goalDetail.goalId,
      categoryId: this.goalDetail.categoryId, category: this.goalDetail.category, status: 'completed'};

      this.cs.getGoalDetails(request).subscribe(data=> {
        var completedTaskRes = data;
        this.completedTask = completedTaskRes.data.goalInfo.tasks;
        this.comService.clearLoader();
      })
    this.comService.clearLoader();
  }

  getAllNotes(task){
    var param ={
      taskId : task.actionPlanDetailId,
      repId : this.actionPlanDet.repId
    }
    this.cs.getAllNotes(param).subscribe(data => {
      this.getAllNotesRes = data;      
      this.allNotes = this.getAllNotesRes.data.notes;
      task.allNt= this.allNotes;
    })
  }

  ngOnInit() {
    this.getCompletedTask();
    
  }

}
