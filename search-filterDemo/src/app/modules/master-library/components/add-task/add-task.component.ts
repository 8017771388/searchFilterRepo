import { Component, OnInit, NgModule, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommunicationService } from '../../../_shared/services/communication.services';
import { MasterLibraryService } from '../../services/master-library.service';
import { UserInfo } from 'src/app/modules/_shared/services/userInfo.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

    constructor(public bsModalRef: BsModalRef, private communicationService: CommunicationService, private masterLibraryService: MasterLibraryService, private userInfo: UserInfo) { }
    @Output() taskSaved = new EventEmitter();

    public currentUser: any;
    public title: any;
    public taskList: any;
    public taskDesc: string;
    public assignedTo: string = 'vcfo';
    public note: string;
    public categoryId: number;
    public goalId: number;
    public userName: string;
    private statusObj: any;
    public errMsg: string = 'Task Description is required.';

    ngOnInit() {
        this.currentUser = this.userInfo._currentUserFn();
        this.userName = this.currentUser.userName;
    }

    checkDuplicateTask(taskName) {
        this.errMsg = '';
        this.taskList.forEach(element => {
            if (element.task == taskName) {
                this.errMsg = 'Task description is already exists.';
            }
        });
    }

    addTask() {
        var reqPayload = {
            "assignedTo": this.assignedTo,
            "daysToComplete": 0,
            "goalId": this.goalId,
            "note": this.note,
            "task": this.taskDesc,
            "taskId": 0,
            "username": this.userName
        }
        this.masterLibraryService.updateTask(reqPayload).subscribe(resp => {
            this.statusObj = resp;
            if (this.statusObj.status == 'success') {
                this.taskSaved.emit("true");
                this.bsModalRef.hide();
            } else {
                this.taskSaved.emit("false");
            }
        })
    }

}
