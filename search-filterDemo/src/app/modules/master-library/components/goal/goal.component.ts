import { Component, OnInit } from '@angular/core';
import { MasterLibraryService } from '../../services/master-library.service';
import { UserInfo } from 'src/app/modules/_shared/services/userInfo.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddGoalComponent } from '../add-goal/add-goal.component';
import { ConfirmModalComponent } from 'src/app/modules/_shared/components/confirm-modal/confirm-modal.component';
import { CommunicationService } from '../../../_shared/services/communication.services';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {
  isCollapsed = false;
    constructor(private masterLibraryService: MasterLibraryService, private communicationService: CommunicationService, private userInfo : UserInfo, private modalService : BsModalService) { }

  public categoryList : any = { 'status' : '', data : []};
  public currentUser : any;
  public statusObj : any;
  public errorMessage : string;
  public bsModalRef : BsModalRef;
  public selectedCategory : any;
  public goalList : any = { 'status' : '', data : []};
  public coppiedGoal : any;
  public errMsg: any;
  public searchGoal: string = null;
  goalSearched : boolean = false;

    ngOnInit() {
        this.currentUser = this.userInfo._currentUserFn();
        this.communicationService.displayLoader(true);
        this.getAllCategories();
  }

  checkDuplicateGoal(goalName, i){
    this.errMsg = '';
    this.goalList.data.forEach((element, index) => {
      if(index != i){
        if(goalName == element.goal){
          this.errMsg = 'Goal description is already exists.';
        }
      }
    });
  }

  getAllCategories(){
    this.communicationService.displayLoader(true);
    this.masterLibraryService.getAllCategories().subscribe(resp => {
      this.categoryList = resp
      if(this.categoryList.status != 'success'){
        this.categoryList.data = [];
      }
      this.communicationService.clearLoader(); 
    })
  }

  getGoals(event, searchTxt){
      this.communicationService.displayLoader(true);
      var catId = 0;
      ////console.log(this.selectedCategory);
      if(this.selectedCategory){
        //this.selectedCategory = {};
        catId = this.selectedCategory.categoryId ? this.selectedCategory.categoryId : 0;
      }
      if(searchTxt == null){
        this.searchGoal = '';
        this.goalSearched = false;
      }else{
        this.goalSearched = true;
      }
      this.masterLibraryService.getAllGoals(catId, searchTxt).subscribe(resp => {
      this.goalList = resp
      if(this.goalList.status != 'success'){
          this.goalList.data = [];
          this.communicationService.clearLoader();   
      }else{
        this.goalList.data.forEach(goal => {
          goal.isCollapsed = false;
        });
          this.coppiedGoal = this.goalList.data.map(x => Object.assign({}, x));
          this.communicationService.clearLoader();   
      }
          this.communicationService.clearLoader();   
    })
  }

  updateGoal(goal){
    //console.log(goal);
    var reqPayload = {"goalId":goal.goalId,
                      "goal":goal.goal,
                      "infoDescription": goal.infoDescription,
                      "username":this.currentUser.userName,
                      "categoryId" : this.selectedCategory.categoryId
                    }
    this.masterLibraryService.updateGoal(reqPayload).subscribe(resp => {
      this.statusObj = resp;
      if(this.statusObj.status == 'success'){
        this.getGoals(this.selectedCategory, this.searchGoal);
      }else{
        this.errorMessage = 'Something went wrong';
      }
    })
  }

  addGoal(){
    let initialState = {
      title: 'Add New Goal',
      goalList : this.goalList.data,
      categoryId : this.selectedCategory.categoryId
    };

    this.bsModalRef = this.modalService.show(AddGoalComponent, {initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false,  class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.goalSaved.subscribe(value => {
      if(value === 'true'){
        this.getGoals(this.selectedCategory.categoryId, this.searchGoal);
      }
    })
  }

  searchWithTxt(e : any){
    if(e.keyCode == 13){
      var categoryId;
      if(!this.selectedCategory){
        categoryId = 0;
      }else{
        categoryId = this.selectedCategory.categoryId;
      }
      this.getGoals(categoryId, this.searchGoal);      
    }
  }

  deleteGoal(goal){    
    let initialState = {
      title: 'Delete Goal',
      confirmTxt : 'Are you sure you want to delete the goal? All the Tasks under this goal will be deleted.'
    };

    this.bsModalRef = this.modalService.show(ConfirmModalComponent, {initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false,  class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.confirm.subscribe(value => {
      if(value === 'true'){
        //this.getAllCategories();
        var deletePayload = {
          goalId : goal.goalId,
          userName : this.currentUser.userName
        };

        this.masterLibraryService.deleteGoal(deletePayload).subscribe(resp => {
          this.statusObj = resp;
          if(this.statusObj.status == 'success'){
            this.getGoals(this.selectedCategory.categoryId, this.searchGoal);
          }else{
            this.errorMessage = 'Something went wrong';
          }
        })
      }
    })
  }

}
