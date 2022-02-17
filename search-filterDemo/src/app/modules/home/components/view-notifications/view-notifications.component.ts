import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CorePlanService } from '../../services/core-plan.service';


@Component({
  selector: 'app-view-notifications',
  templateUrl: './view-notifications.component.html',
  styleUrls: ['./view-notifications.component.scss']
})
export class ViewNotificationsComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private modalService: BsModalService, private cs : CorePlanService) { }
  @Output() readNote = new EventEmitter();

  public currentUser: any;
  public title: any;
  public notificationList: any;
  public getAllNotesRes : any;
  public allNotes : any = [];
  public notesTask : any = [];
  public showNotes : boolean = false;

  ngOnInit() {
    this.notificationList.forEach(val => {
      val.isOpen = false;
      val.isRead = false;
    });
    //console.log(this.notificationList);
  }

  viewNewNotes(taskDetails){
    //this.showNotes = true; 
    if(!taskDetails.isOpen){
      var param ={
        taskId : taskDetails.ActionPlanDetailId,
        repId : null
      }
      this.cs.getAllNotes(param, 'U').subscribe(data => {
        this.getAllNotesRes = data;
        this.allNotes = this.getAllNotesRes.data.notes;
        this.notesTask = this.getAllNotesRes.data.taskInfo;
        //this.allNotes = [{'note': 'note', 'createdBy' : 'createdBy'},{'note': 'note', 'createdBy' : 'createdBy'},{'note': 'note', 'createdBy' : 'createdBy'},{'note': 'note', 'createdBy' : 'createdBy'},{'note': 'note', 'createdBy' : 'createdBy'}];
        this.notificationList.forEach(val => {          
          if(val.isOpen){
            val.isRead = true;
            val.isOpen = false;
          }          
        });
        taskDetails.isOpen = true;
      })
    }else{
      taskDetails.isOpen = false;
      taskDetails.isRead = true;
    }
  }

  hideNotes(){
    this.readNote.emit("true");
    this.bsModalRef.hide(); 
  }

}
