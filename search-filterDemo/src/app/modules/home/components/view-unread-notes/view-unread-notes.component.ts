import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CorePlanService } from '../../services/core-plan.service';


@Component({
  selector: 'app-view-unread-notes',
  templateUrl: './view-unread-notes.component.html',
  styleUrls: ['./view-unread-notes.component.scss']
})
export class ViewUnreadNotesComponent implements OnInit {

  constructor(public bsModalRef : BsModalRef, private cs : CorePlanService) { }

  public currentUser: any;
  public title: any;
  public taskDetails: any;
  public getAllNotesRes : any;
  public allNotes : any = [];
  public notesTask : any = [];

  ngOnInit() {
    //console.log(this.currentUser);
    this.getAllNotes()
  }

  getAllNotes(){
    var param ={
      taskId : this.taskDetails.ActionPlanDetailId,
      repId : null
    }
    this.cs.getAllNotes(param).subscribe(data => {
      this.getAllNotesRes = data;
      this.allNotes = this.getAllNotesRes.data.notes;
      this.notesTask = this.getAllNotesRes.data.taskInfo;
    })
  }

}
