import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CorePlanService } from  '../../../home/services/core-plan.service';
import { CommunicationService } from '../../../_shared/services/communication.services';
import { TASK_STATUS, GOAL_STATUS } from '../../../_shared/constants/global.constant';
import { DatePipe } from '@angular/common';
import { ANALYST } from '../../constants/global.constant';

@Component({
  selector: 'app-add-view-notes',
  templateUrl: './add-view-notes.component.html',
  styleUrls: ['./add-view-notes.component.scss']
})
export class AddViewNotesComponent implements OnInit {

  @Output() notesChanged = new EventEmitter();

  public taskConstant = TASK_STATUS;
  public goalConstant = GOAL_STATUS;
  public taskDetail : any;
  public goalDetail : any;
  public repId : any;
  public currentUser : any;
  public title : any;
  public getAllNotesRes : any;
  public allNotes : any;
  public notesTask : any;
  public noteTxt : any;
  public showSpinner : boolean = false;
  public noteRequired : boolean = false;
  public userType : any;
  public analyst : string = ANALYST;

  constructor(public bsModalRef: BsModalRef, private cs : CorePlanService, private comSerive : CommunicationService) { }

  getAllNotes(){
    var param ={
      taskId : this.taskDetail.actionPlanDetailId,
      repId : this.repId
    }
    this.cs.getAllNotes(param).subscribe(data => {
      this.comSerive.displayLoader(true);
      this.getAllNotesRes = data;
      this.allNotes = this.getAllNotesRes.data.notes;
      this.notesTask = this.getAllNotesRes.data.taskInfo;
      this.comSerive.clearLoader();
    })
  }

  saveNote(){
    this.comSerive.displayLoader(true);
    if(this.noteTxt){
      this.noteRequired = false;
      this.showSpinner = true;
      var notevisibilitylevel = (this.userType === this.analyst ) ? 1 : 0; 
      var param= {
        actionPlanDetailId: this.taskDetail.actionPlanDetailId,
        username: this.currentUser.userName,
        noteId: 0,
        note: this.noteTxt,
        vcfoOrAdvisor: this.taskDetail.vcfoOrAdvisor,
        isVisibleToVCFO: notevisibilitylevel,
        isActive:1,
        Notevisibilitylevel : notevisibilitylevel
      };
      this.cs.addNote(param).subscribe(data => {
        this.showSpinner = false;
        this.getAllNotes();
        this.noteTxt = "";
        this.notesChanged.emit("true");
        this.comSerive.clearLoader();
      })
      this.comSerive.clearLoader();
    }
    else{
         this.noteRequired = true;
         this.comSerive.clearLoader();
      }
  }  

  ngOnInit() {
    this.getAllNotes();     
  }

}
