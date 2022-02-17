import { Component, OnInit } from '@angular/core';
import { CorePlanService } from '../../services/core-plan.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddNewGoalComponent } from '../../../_shared/components/add-new-goal/add-new-goal.component';
import { UserInfo } from 'src/app/modules/_shared/services/userInfo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AddTaskComponent } from 'src/app/modules/_shared/components/add-task/add-task.component';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { ANALYST } from '../../../_shared/constants/global.constant';
import { CommunicationService } from 'src/app/modules/_shared/services/communication.services';



@Component({
  selector: 'app-build-core-plan',
  templateUrl: './build-core-plan.component.html',
  styleUrls: ['./build-core-plan.component.scss']
})
export class BuildCorePlanComponent implements OnInit {
  private planRequest : any = {
    repId : null,
    username : null,
    task : []
  };

  isCollapsed = false;
  public categoryGoalList : any = null;
  public tempArrayToStoreGoal = []; 
  public bsModalRef : BsModalRef;
  public currentUser : any;
  public incrementalId : number = 0;
  public repId :string;
  public advisorName : string;
  public cfoName : string;
  public cfoUserName : string;
  goalObj : any;
  taskObj : any;
  coppiedData : any = null;
  searchTxt : string = null;
  saveBtnEnabled : boolean = false;
  analyst : string = ANALYST;
  public userType : any;

  constructor(private corePlanService : CorePlanService, private modalService : BsModalService, private userInfo : UserInfo, private route : ActivatedRoute, private router : Router, private communicationService : CommunicationService) { }

  ngOnInit() {
    this.currentUser = this.userInfo._currentUserFn(); 
    this.getCategoryGoalsList();
    this.repId = this.route.snapshot.paramMap.get("repid");
    this.advisorName =this.route.snapshot.paramMap.get("advisor");
    this.cfoName = this.route.snapshot.paramMap.get("cfoname");
    this.cfoUserName = this.route.snapshot.paramMap.get("vcfo");
    this.planRequest.repId = this.repId;
    this.planRequest.username = this.currentUser.userName;
    this.communicationService.getAccessType().subscribe( userType => this.userType = userType);
    
  }

  getCategoryGoalsList(){
    this.corePlanService.getCategoryGoalsList().subscribe(result => {
      if(result){
        this.categoryGoalList = result;
        this.categoryGoalList.data.masterlibrary.forEach(element => {
          element.isCollapsed = false;
          element.switch = false;
          if(element.goals.length > 0){
            element.goals.forEach(goal => {
              goal.checked = false;
              goal.tasks = [];
            });
          }
        });
      }
    })
  }

  addGoaltoTemp(event, category, goal){
    ////console.log(event, category, goal);
    if(event.target.checked){
      goal.checked = true;
      this.saveBtnEnabled = true;
      ////console.log(category.switch);
      if(!category.switch){
        category.isCollapsed = true;
        category.switch = true;        
      }      
      var tempArr = this.tempArrayToStoreGoal.filter( val => val.categoryid == category.categoryid);
      if(tempArr.length == 0)
        this.tempArrayToStoreGoal.push(category);
    }else{
      goal.checked = false;   
      this.saveBtnEnabled = false;   
      if(this.tempArrayToStoreGoal.length > 0){
        this.tempArrayToStoreGoal.forEach( (element, index) => {          
          if(element.categoryid == category.categoryid){
            var tempFlag = false;
            element.goals.forEach(val => {
              if(val.checked)
                tempFlag = true;
            });
            ////console.log(tempFlag);
            if(!tempFlag){
              this.tempArrayToStoreGoal.splice(index, 1);
              //category.switch = false;
            }
          }
        })
      }
    }
    ////console.log(this.tempArrayToStoreGoal);
    if(this.tempArrayToStoreGoal.length > 0){
      this.saveBtnEnabled = true;  
    }else{
      this.saveBtnEnabled = false;  
    }
  }

  addNewGoal(category){
    let initialState = {
      actionPlanId: null,
      currentUser : null,
      title: 'Add New Goal',
      openFrom : 'build-core-plan'
    };

    this.bsModalRef = this.modalService.show(AddNewGoalComponent, {initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false,  class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.goalSaved.subscribe(value => {
      category.goals.push({goal: value, goalId: 'NEW'+this.incrementalId, infoDescription: value, tasks : []});
      this.incrementalId++;
    })
  }

  addTask(category,goal) {
    let initialState = {
      currentUser : this.currentUser,
      advisorDetail : null,
      goalDetail : goal,
      title: 'Add Task',
      cfoname : this.cfoName,
      cfoUserName : this.cfoUserName,
      repId : this.repId,
      openFrom : 'build-core-plan'
    };
    

    this.bsModalRef = this.modalService.show(AddTaskComponent, {initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false,  class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.taskSaved.subscribe(val => {
      this.modifyTask(val,category,goal,null);
    })

    
  }

  editTask(task,goal,category){
    let initialState = {
      currentUser : this.currentUser,
      advisorDetail : null,
      goalDetail : goal,
      title: 'Edit Task',
      cfoname : this.cfoName,
      cfoUserName : this.cfoUserName,
      repId : this.repId,
      openFrom : 'build-core-plan',
      taskData : task
    };
    

    this.bsModalRef = this.modalService.show(AddTaskComponent, {initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false,  class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.taskSaved.subscribe(val => {
      if(val){
        this.modifyTask(val,category,goal,task);
      }
    })
  }

  modifyTask(val,category,goal,task){    
    if(val){
      if(!task){
        if(Array.isArray(val.task)){
          val.task.forEach( (elem, index) => {
            var taskInfo = {
                "category": category.category,
                "categoryId" : category.categoryid,
                "goal": goal.goal,
                "task": elem,
                "duedate": val.duedate,
                "VCFOorAdvisor": val.VCFOorAdvisor,
                "assginedTo": val.assignedTo,
                "status": 1,
                "note": val.note,
                "isActive": 1,
                "goalId": goal.goalId,
                "elapsedTime":val.elapsedTime,
                "internalDueDate" : val.internalDueDate,
                "internalStatus" : val.internalStatus,
              }
              goal.tasks.push(taskInfo);
          })          
        }else{
          var taskInfo = {
            "category": category.category,
            "categoryId" : category.categoryid,
            "goal": goal.goal,
            "task": val.task,
            "duedate": val.duedate,
            "VCFOorAdvisor": val.VCFOorAdvisor,
            "assginedTo": val.assignedTo,
            "status": 1,
            "note": val.note,
            "isActive": 1,
            "goalId": goal.goalId,
            "elapsedTime":val.elapsedTime,
            "internalDueDate" : val.internalDueDate,
            "internalStatus" : val.internalStatus,
          }
          goal.tasks.push(taskInfo);
        }
      }else{
        task.task = val.task;
        task.duedate = val.duedate;
        task.VCFOorAdvisor = val.VCFOorAdvisor;
        task.assginedTo = val.assginedTo;
        task.note = val.note;
        task.elapsedTime  = val.elapsedTime,
        task.internalDueDate = val.internalDueDate,
        task.internalStatus = val.internalStatus
      }
      this.saveBtnEnabled = true;
    }
  }

  deleteTask(task, goal){
    goal.tasks.forEach((val, i) => {
      if(val.task == task.task)
        goal.tasks.splice(i, 1);
    });
  }

  savePlan(){    
    this.planRequest.task = [];
    this.categoryGoalList.data.masterlibrary.forEach((category, i) => {
      ////console.log(category);
      if(category.goals.length > 0 && category.switch){
        category.goals.forEach((goal, j) => {
          if(goal.checked){
            this.goalObj = {
              "category": category.category,
              "categoryId": category.categoryid,
              "goal": goal.goal,
              "task": null,
              "duedate": null,
              "VCFOorAdvisor": null,
              "assignedTo": null,
              "status": null,
              "note": null,
              "isActive": 1,
              "goalId": !Number.isInteger(goal.goalId) ? "" : goal.goalId
            }
            this.planRequest.task.push(this.goalObj);
            if(goal.tasks.length > 0)
            {
              goal.tasks.forEach((task,k) => {
                var notevisibilitylevel = (this.userType === this.analyst && task.note !== '') ? 1 : 0;
                  this.taskObj = {
                    "category": category.category,
                    "categoryId": category.categoryid,
                    "goal": goal.goal,
                    "task": task.task,
                    "duedate": task.duedate ? task.duedate : '',
                    "VCFOorAdvisor": task.VCFOorAdvisor ? task.VCFOorAdvisor : '',
                    "assignedTo": task.assginedTo ? task.assginedTo : '',
                    "status": 1,
                    "note": task.note ? task.note : '',
                    "isActive": 1,
                    "goalId": !Number.isInteger(goal.goalId) ? null : goal.goalId,
                    "elapsedTime":task.elapsedTime,
                    "internalDueDate" : task.internalDueDate,
                    "internalStatus" : task.internalStatus,
                    "notevisibilitylevel" : notevisibilitylevel
                  }
                  this.planRequest.task.push(this.taskObj);                  
                  this.planRequest.noteVisibilityLevel = notevisibilitylevel;
              });
            }
          }
        });
      }
    });
    if(this.planRequest.task.length > 0){
      this.corePlanService.modifyTask(this.planRequest).subscribe(result => {
        //////console.log(result)
        if(result){
          this.router.navigate(['/home/core-plan/', this.repId, this.advisorName]);
        }
      })
    }
    //////console.log('plan request', this.planRequest);
  }
    cancel() { this.router.navigate(['/home']);}

  switchAccordian(category){
    //console.log(category.switch);
    if(!category.switch)
      category.isCollapsed = true;
    else{
      category.isCollapsed = false;
      //console.log(this.tempArrayToStoreGoal);
      if(this.tempArrayToStoreGoal.length > 0){
        this.tempArrayToStoreGoal.forEach( (element, index) => {          
          if(element.categoryid == category.categoryid){
            var tempFlag = false;
            element.goals.forEach((val, i) => {
              if(val.checked){
                tempFlag = true;
                category.goals[i].checked = false;
                
              }
            });
            ////console.log(tempFlag);
            if(tempFlag){
              this.tempArrayToStoreGoal.splice(index, 1);
              //category.switch = false;
            }
          }
        })
      }
    }
    //console.log(this.tempArrayToStoreGoal);
    if(this.tempArrayToStoreGoal.length > 0){
      this.saveBtnEnabled = true;  
    }else{
      this.saveBtnEnabled = false;  
    }

  }

  searchCategoryAndGoal(e : any){
    ////console.log(e);
    if(!this.coppiedData)
      this.coppiedData = JSON.parse(JSON.stringify(this.categoryGoalList.data));
    var newArray = [];
    if(this.searchTxt){
      if(this.categoryGoalList.data.masterlibrary.length < this.coppiedData.masterlibrary.length)
        this.categoryGoalList.data = JSON.parse(JSON.stringify(this.coppiedData));
      this.categoryGoalList.data.masterlibrary.forEach((cat, i) => {
        cat.isCollapsed = false;        
        var newGoal = [];
        cat.goals.forEach(goal => {
          if(goal.goal.toLowerCase().indexOf(this.searchTxt.toLowerCase()) >= 0){
            cat.isCollapsed = true;
            newGoal.push(goal);
          }
        });

        if(cat.category.toLowerCase().indexOf(this.searchTxt.toLowerCase()) >= 0){
          newArray.push(cat);
        }
        
        if(newGoal.length > 0){
          if(!newArray[i]){
            cat.goals = newGoal;
            newArray.push(cat);
          }else{
            newArray[i].goals = newGoal;
          }
        }
      })
      this.categoryGoalList.data.masterlibrary = newArray;
    }else{
      this.categoryGoalList.data = this.coppiedData;
      this.categoryGoalList.data.masterlibrary.forEach(element => {
        element.isCollapsed = false;
      });
      ////console.log(this.categoryGoalList.data);
      this.coppiedData = null;
    }
    ////console.log(this.coppiedData);
  }

}
