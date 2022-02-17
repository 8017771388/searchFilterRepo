import { Component, OnInit, NgModule, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommunicationService } from '../../../_shared/services/communication.services';
import { MasterLibraryService } from '../../services/master-library.service';
import { UserInfo } from 'src/app/modules/_shared/services/userInfo.service';



@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})

export class AddCategoryComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private communicationService: CommunicationService, private masterLibraryService : MasterLibraryService, private userInfo : UserInfo) { }
  @Output() categorySaved = new EventEmitter();

  public currentUser : any;
  public title : any;
  public categoryList : any;
  public categoryDesc : string;
  public purpose : string;
  public userName : string;
  private statusObj : any;
  public errMsg : string = 'Category Description is required.';

  ngOnInit() {
    this.currentUser = this.userInfo._currentUserFn();    
    this.userName = this.currentUser.userName;
  }

  checkDuplicateCategory(categoryName){
    this.errMsg = '';
    this.categoryList.forEach(element => {
      if(element.category == categoryName){
        this.errMsg = 'Category description is already exists.';
      }
    });
  }

  addCategory(){
    var reqPayload = {"categoryid":0,
                      "category":this.categoryDesc,
                      "purpose": this.purpose,
                      "username":this.userName
                    }
    this.masterLibraryService.updateCategory(reqPayload).subscribe(resp => {
      this.statusObj = resp;
      if(this.statusObj.status == 'success'){
        this.categorySaved.emit("true");
        this.bsModalRef.hide();
      }else{
        this.categorySaved.emit("false");
      }
    })
  }

}
