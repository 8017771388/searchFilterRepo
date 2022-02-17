import { Component, OnInit } from '@angular/core';
import { MasterLibraryService } from '../../services/master-library.service';
import { UserInfo } from 'src/app/modules/_shared/services/userInfo.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { ConfirmModalComponent } from 'src/app/modules/_shared/components/confirm-modal/confirm-modal.component';
import { CommunicationService } from '../../../_shared/services/communication.services';



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
 
  //isCollapsed = false;
    constructor(private masterLibraryService: MasterLibraryService, private communicationService: CommunicationService, private userInfo : UserInfo, private modalService : BsModalService) { }

  public categoryList : any = { 'status' : '', data : []};
  public currentUser : any;
  private updateCatReqObj : any = {
                                    'categoryid': null,
                                    'category': null,
                                    'purpose': null,
                                    'username': null
                                  };
  public statusObj : any;
  public errorMessage : string;
  public bsModalRef : BsModalRef;
  public coppiedCategory : any;
  public errMsg : string;
  public searchTxt : string = '';

  ngOnInit() {
    this.currentUser = this.userInfo._currentUserFn();
      this.updateCatReqObj.username = this.currentUser.userName;
      this.communicationService.displayLoader(true);
    this.getAllCategories();
  }

    getAllCategories() {
    this.communicationService.displayLoader(true);
    this.masterLibraryService.getAllCategories().subscribe(resp => {
      this.categoryList = resp
      if(this.categoryList.status != 'success'){
          this.categoryList.data = [];
          this.communicationService.clearLoader();   
      }else{
        this.categoryList.data.forEach(cat => {
          cat.isCollapsed = false;
        });
        this.coppiedCategory = this.categoryList.data.map(x => Object.assign({}, x));
      }
        //console.log(this.coppiedCategory);
        this.communicationService.clearLoader();   
    })
  }

  checkDuplicateCategory(categoryName, i){
    this.errMsg = '';
    this.categoryList.data.forEach((element, index) => {
      if(index != i){
        if(categoryName == element.category){
          this.errMsg = 'Category description is already exists.';
        }
      }
    });
  }

  updateCategory(category){
    this.updateCatReqObj.category = category.category;
    this.updateCatReqObj.categoryid = category.categoryId;
    this.updateCatReqObj.purpose = category.purpose;
    this.masterLibraryService.updateCategory(this.updateCatReqObj).subscribe(resp => {
      this.statusObj = resp;
      if(this.statusObj.status == 'success'){
        this.getAllCategories();
      }else{
        this.errorMessage = 'Something went wrong';
      }
    })
  }

  addCategory(){
    let initialState = {
      title: 'Add New Category',
      categoryList : this.categoryList.data
    };

    this.bsModalRef = this.modalService.show(AddCategoryComponent, {initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false,  class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.categorySaved.subscribe(value => {
      if(value === 'true'){
        this.getAllCategories();
      }
    })
  }

  deleteCategory(category){    
    let initialState = {
      title: 'Delete Category',
      confirmTxt : 'Are you sure you want to delete the category? All the goals and Tasks under this category will be deleted.'
    };

    this.bsModalRef = this.modalService.show(ConfirmModalComponent, {initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false,  class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.confirm.subscribe(value => {
      if(value === 'true'){
        //this.getAllCategories();
        var deletePayload = {
          categoryId : category.categoryId,
          userName : this.currentUser.userName
        }

        this.masterLibraryService.deleteCategory(deletePayload).subscribe(resp => {
          this.statusObj = resp;
          if(this.statusObj.status == 'success'){
            this.getAllCategories();
          }else{
            this.errorMessage = 'Something went wrong';
          }
        })
      }
    })
  }

}
