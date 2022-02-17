import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CorePlanService } from  '../../../home/services/core-plan.service';
import { CommunicationService } from '../../../_shared/services/communication.services';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-goal-reorder',
  templateUrl: './goal-reorder.component.html',
  styleUrls: ['./goal-reorder.component.scss']
})
export class GoalReorderComponent implements OnInit {

  @Output() orderSaved = new EventEmitter(); 

  public allGoals : any;
  public goalObj : any;
  public title : any;
  public currentUser : any;

  constructor(public bsModalRef: BsModalRef, private cs : CorePlanService, private communicationService : CommunicationService, public orderPipe : OrderPipe) {
 
  }

  onDrop(event: CdkDragDrop<string[]>) {
    //console.log(event);
    // moveItemInArray(
    //    this.allNumbers, 
    //    event.previousIndex, 
    //    event.currentIndex
    // );
    if (event.previousContainer === event.container) {
           moveItemInArray(this.allGoals, event.previousIndex, event.currentIndex);
   } else {
      transferArrayItem(event.previousContainer.data,
      this.allGoals,
      event.previousIndex,
      event.currentIndex);
   }
     
    this.allGoals.forEach((itemSorted, index) => {
      itemSorted.goalOrder = index + 1;
    });
   
  } 

  saveOrder(){
    var param = {
      actionPlanID : this.goalObj.actionplanId,
      username: this.currentUser.userName,
      jsonGoals: this.allGoals
    }
    this.cs.saveGoalOrder(param).subscribe(data => {
      this.orderSaved.emit("true");
      this.bsModalRef.hide();
    })
  }

  ngOnInit() {     
    //this.allGoals = this.goalObj.goals.slice(); 
    this.allGoals = JSON.parse(JSON.stringify(this.goalObj.goals)); 
  }

}
