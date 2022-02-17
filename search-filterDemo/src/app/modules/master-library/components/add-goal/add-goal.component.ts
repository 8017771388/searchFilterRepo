import { Component, OnInit, NgModule, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommunicationService } from '../../../_shared/services/communication.services';
import { MasterLibraryService } from '../../services/master-library.service';
import { UserInfo } from 'src/app/modules/_shared/services/userInfo.service';



@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})

export class AddGoalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private communicationService: CommunicationService, private masterLibraryService : MasterLibraryService, private userInfo : UserInfo) { }
  @Output() goalSaved = new EventEmitter();

  public currentUser : any;
  public title : any;
  public goalList : any;
  public goalDesc : string;
  public moreInformation : string;
  public categoryId : number;
  public userName : string;
  private statusObj : any;
  public errMsg : string = 'Goal Description is required.';

  ngOnInit() {
    this.currentUser = this.userInfo._currentUserFn();    
    this.userName = this.currentUser.userName;
  }

  checkDuplicateGoal(goalName){
    this.errMsg = '';
    this.goalList.forEach(element => {
      if(element.goal == goalName){
        this.errMsg = 'Goal description is already exists.';
      }
    });
  }

  addGoal(){
    var reqPayload = {"goalid":0,
                      "goal":this.goalDesc,
                      "infoDescription": this.moreInformation,
                      "username":this.userName,
                      "categoryId" : this.categoryId
                    }
    this.masterLibraryService.updateGoal(reqPayload).subscribe(resp => {
      this.statusObj = resp;
      if(this.statusObj.status == 'success'){
        this.goalSaved.emit("true");
        this.bsModalRef.hide();
      }else{
        this.goalSaved.emit("false");
      }
    })
  }

}
