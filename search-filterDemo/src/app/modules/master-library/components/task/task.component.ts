import { Component, OnInit } from '@angular/core';
import { MasterLibraryService } from '../../services/master-library.service';
import { UserInfo } from 'src/app/modules/_shared/services/userInfo.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/modules/_shared/components/confirm-modal/confirm-modal.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { CommunicationService } from '../../../_shared/services/communication.services';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  isCollapsed = false;  

    constructor(private masterLibraryService: MasterLibraryService, private communicationService: CommunicationService, private userInfo : UserInfo, private modalService : BsModalService) { }

  public categoryList : any = { 'status' : '', data : []};
  public currentUser : any;
  public statusObj : any;
  public errorMessage : string;
  public bsModalRef : BsModalRef;
  public selectedCategory : any;
  public goalList : any = { 'status' : '', data : []};
  public taskList : any = { 'status' : '', data : []};
  public coppiedTask: any;    
  public errMsg : any;
  public selectedGoal : any;
  public taskDesc: string;
  public assignedTo: string;
  public note: string;
  public categoryId: number;
  public goalId: number;
  public searchTask : string = null;
  taskSearched : boolean = false;
    
    ngOnInit() {
        this.currentUser = this.userInfo._currentUserFn();
        this.communicationService.displayLoader(true);
    this.getAllCategories();
  }

  checkDuplicateTask(taskName, i){
    this.errMsg = '';
    this.taskList.data.forEach((element, index) => {
      if(index != i){
        if(taskName == element.task){
          this.errMsg = 'Task is already exists.';
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

  getGoals(event) {
      this.communicationService.displayLoader(true);
      this.masterLibraryService.getAllGoals(this.selectedCategory.categoryId, null).subscribe(resp => {
          this.goalList = resp
          this.taskList.data = [];
          if (this.goalList.status != 'success') {
              this.goalList.data = [];
          } else {
              this.goalList.data.forEach(goal => {
                  goal.isCollapsed = false;
              });
              //this.coppiedGoal = this.goalList.data.map(x => Object.assign({}, x));
          }
          this.communicationService.clearLoader();   
      })
  }

    getTasks(event, categoryId, sarchTxt) {
        this.communicationService.displayLoader(true);
        var goalId = 0;
        //console.log(this.selectedGoal);
        if(this.selectedGoal){
          goalId = this.selectedGoal.goalId ? this.selectedGoal.goalId : 0;
        }
        if(!sarchTxt){
          this.searchTask = '';
          this.taskSearched = false;
        }else{
          this.taskSearched = true;
        }
      this.masterLibraryService.getAllTasks(goalId, categoryId, sarchTxt).subscribe(resp => {
      this.taskList = resp
      this.communicationService.clearLoader();
      this.taskList.data.forEach(element => {
        element.assignedTo = element.assignedTo.toLowerCase().trim();
      });
      if(this.taskList.status != 'success'){
          this.taskList.data = [];
          this.communicationService.clearLoader();   
      }else{
        this.taskList.data.forEach(task => {
          task.isCollapsed = false;
        });
          this.coppiedTask = this.taskList.data.map(x => Object.assign({}, x));
          this.communicationService.clearLoader();   
      }
           
    })
  }

    addTask() {
        let initialState = {
            title: 'Add New Task',
            taskList: this.taskList.data,
            goalId: this.selectedGoal.goalId
        };

        this.bsModalRef = this.modalService.show(AddTaskComponent, { initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false, class: 'modal-lg' });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.taskSaved.subscribe(value => {
            if (value === 'true') {
                this.getTasks(this.selectedGoal.goalId, this.selectedCategory.categoryId, this.searchTask);
            }
        })
    }
    updateTask(task) {       
        var reqPayload = {
            "assignedTo": task.assignedTo,
            "daysToComplete": 0,
            "goalId": task.goalId,
            "note": task.note,
            "task": task.task,
            "taskId": task.taskId,
            "username": this.currentUser.userName
        }
        this.masterLibraryService.updateTask(reqPayload).subscribe(resp => {
            this.statusObj = resp;
            if (this.statusObj.status == 'success') {
                this.getTasks(this.selectedGoal.goalId, this.selectedCategory.categoryId, this.searchTask);
            } else {
                this.errorMessage = 'Something went wrong';
            }
        })
    }

    searchWithTxt(e : any){
      if(e.keyCode == 13){
        var goalId;
        var categoryId;
        if(!this.selectedGoal){
          goalId = 0;
        }else{
          goalId = this.selectedGoal.goalId;
        }

        if(!this.selectedCategory){
          categoryId = 0;
        }else{
          categoryId = this.selectedCategory.categoryId;
        }
        this.getTasks(goalId, categoryId, this.searchTask);
      }
    }

    deleteTask(task) {
        let initialState = {
            title: 'Delete Task',
            confirmTxt: 'Are you sure you want to delete the Task?'
        };

        this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false, class: 'modal-lg' });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.confirm.subscribe(value => {
            if (value === 'true') {
                //this.getAllCategories();
                var deletePayload = {
                    taskId: task.taskId,
                    userName: this.currentUser.userName
                };

                this.masterLibraryService.deleteTask(deletePayload).subscribe(resp => {
                    this.statusObj = resp;
                    if (this.statusObj.status == 'success') {
                        this.getTasks(this.selectedGoal.goalId, this.selectedCategory.categoryId, this.searchTask);
                    } else {
                        this.errorMessage = 'Something went wrong';
                    }
                })
            }
        })
    }
}
