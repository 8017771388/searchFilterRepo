import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CorePlanService } from  '../../../home/services/core-plan.service';
import { CommunicationService } from '../../../_shared/services/communication.services';

@Component({
  selector: 'app-delete-goal-task',
  templateUrl: './delete-goal-task.component.html',
  styleUrls: ['./delete-goal-task.component.scss']
})
export class DeleteGoalTaskComponent implements OnInit {
  @Output() goalDeleted = new EventEmitter();

  public title : any;
  public actionPlanDet : any;
  public goalDetail : any;
  public currentUser : any;

  constructor(public bsModalRef: BsModalRef, private cs : CorePlanService, private comService : CommunicationService) { }

  deleteGoal(){
    this.comService.displayLoader(true);
    var deleteGoalObj = {
      actionPlanId: this.actionPlanDet.actionplanId,
      actionPlanDetailId: this.actionPlanDet.actionplanId,
      goal: this.goalDetail.goal,
      categoryId : this.goalDetail.categoryId,
      username: this.currentUser.userName,
    }

    this.cs.deleteGoal(deleteGoalObj).subscribe(response => {
      this.goalDeleted.emit("true");
      this.bsModalRef.hide();
      this.comService.clearLoader();
    })
    this.comService.clearLoader();
  }

  deleteTask(){
    this.comService.displayLoader(true);
    var deleteTaskObj = {
      actionPlanId: this.actionPlanDet.actionplanId,
      actionPlanDetailId: this.goalDetail.actionPlanDetailId,
      username: this.currentUser.userName,
    };

    this.cs.deleteTask(deleteTaskObj).subscribe(response => {
      this.goalDeleted.emit("true");
      this.bsModalRef.hide();
      this.comService.clearLoader();
    })
    this.comService.clearLoader();
  }

  ngOnInit() {
  }

}
