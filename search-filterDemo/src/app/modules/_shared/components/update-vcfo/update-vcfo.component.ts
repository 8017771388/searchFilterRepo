import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdvisorService } from '../../../admin/services/advisor.service';
import { AppSettings } from '../../constants/api-constant';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { Observable, Observer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-update-vcfo',
  templateUrl: './update-vcfo.component.html',
  styleUrls: ['./update-vcfo.component.scss'],
})
export class UpdateVcfoComponent implements OnInit {
  //@Input() vcfoDetail:any
  @Output() updatevcfo = new EventEmitter();
  public dataSource: Observable<any>;
  public reassignCFO : any;
  public title : any;
  public openFor : any;
  public vcfoDetail : any;
  public vcfoDetails : any = {
    "username": '',
    "fullname": "",
    "role": "",
    "isActive": "",
  };
  public userSearched : any;
  public enableSave : boolean = true;
  public currentUser: any;
  public cfosData : any;
  public checkDuplicateCFO : any;
  public cfoExist : boolean = false;
  public message : string = "";
  public vcfoAdManagerGroup = AppSettings.adGroup.vcfoManager.indexOf('\\') != -1 ? AppSettings.adGroup.vcfoManager.split('\\')[1] : AppSettings.adGroup.vcfoManager;
    public vcfoAdGroup = AppSettings.adGroup.vcfo.indexOf('\\') != -1 ? AppSettings.adGroup.vcfo.split('\\')[1] : AppSettings.adGroup.vcfo;
    public vcfoAdAnalystGroup = AppSettings.adGroup.cfoAnalyst.indexOf('\\') != -1 ? AppSettings.adGroup.cfoAnalyst.split('\\')[1] : AppSettings.adGroup.cfoAnalyst;
  public adGroup = {
      vcfo: {
          value: AppSettings.adGroup.vcfo,
          text: "CFO"
      },
      vcfoManager: {
          value: AppSettings.adGroup.vcfoManager,
          text: "CFO Manager"
      },
      analyst: {
        value: AppSettings.adGroup.cfoAnalyst,
        text: "Analyst"
    }
  };
  public adDetailErrorMsg: string ="";
  public warningMessages: any;
  public isCFORoleChanged: boolean = false;
  public advisorList: any;
  public selectedAdvisor : any = [];
  public noResult : any;
  public advsiorSelected: any;
  public reassignWarningMessage : boolean = false;
  public allAdvisorMsg : boolean = false;
  public enableSaveBtn : boolean = false;
  public adData : any;

  constructor(public bsModalRef: BsModalRef, private advisorservice : AdvisorService) {}

  typeaheadOnSelect(event: TypeaheadMatch): void {
    //console.log(event);
    this.enableSaveBtn = false;
    this.vcfoDetails.reassignedRepId =  event.item.vcfoId;
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  advisorSelected(event){
    //console.log(event);
    if(event.length > 0){
      if(this.reassignWarningMessage === true){
        if(this.advisorList.length === event.length){
          this.allAdvisorMsg = false;
          this.enableSaveBtn = true;
          this.reassignWarningMessage = false;
          this.selectedAdvisor = event;
        }
        else{
          this.allAdvisorMsg = true;
        }
      }
      else{
        this.enableSaveBtn = true;
        this.selectedAdvisor = event;
      }
    }
    else{
      if(this.vcfoDetails.isActive === false){
        this.reassignWarningMessage = true;
        this.vcfoDetails.reassignedRepId = '';
        this.reassignCFO = '';
      }
      else{
        this.enableSaveBtn = false;
        this.vcfoDetails.reassignedRepId = '';
        this.reassignCFO = '';
      }
      
    }
    
  }

  checkStatus(event){
    //console.log(event);
    if(this.vcfoDetails.role==='CFO'){
      if(event === false){
        if(this.advisorList.length > 0 && this.selectedAdvisor.length != this.advisorList.length ){
          this.reassignWarningMessage = true;
        }
        else{
          this.reassignWarningMessage = false;
        }
      }
      else{
        this.reassignWarningMessage = false;
      }
    }    
  }

  searchCfo(user){
    this.cfoExist = false;
    this.enableSave = false;
    this.advisorservice.getAdDetail(user).subscribe(data => {
        this.userSearched = data;
     
      if(this.userSearched.data.message === null){
        this.vcfoDetails.fullname = this.userSearched.data.fullName;        
            if (this.userSearched.data.groups && (this.userSearched.data.groups.indexOf(this.vcfoAdManagerGroup) >= 0 || this.userSearched.data.groups.indexOf(this.vcfoAdGroup) >= 0||this.userSearched.data.groups.indexOf(this.vcfoAdAnalystGroup) >= 0)){
          // this.vcfoDetails.role = this.userSearched.data.groups.indexOf(this.vcfoAdManagerGroup) >= 0 ? "CFO Manager" : "CFO";
          this.vcfoDetails.role = this.userSearched.data.groups.indexOf(this.vcfoAdManagerGroup) >= 0 ? "CFO Manager" : (this.userSearched.data.groups.indexOf(this.vcfoAdGroup) >= 0 ? "CFO" : "Analyst");
          this.checkDuplicateCFO.forEach(element => {
            if(element.fullname === this.userSearched.data.fullName){
              this.cfoExist = true;
              this.enableSave = true;
              this.message = "";
              this.adDetailErrorMsg = '';
            }
            else{
              this.adDetailErrorMsg = '';
            }
          });
        }
        else{
          this.vcfoDetails.role = "";
          this.adDetailErrorMsg = "User is not a member of VS_CFO or VS_CFOManager or VS_CFOAnalyst group";
          this.message = "";
          this.cfoExist = false;
        }
        
      }
      else{
        this.message = this.userSearched.data.message;
        this.adDetailErrorMsg = '';
        this.enableSave = true;
      }
      // }
             
      // else{
      //   //this.vcfoDetails.role = "";   
      //   //this.vcfoDetails.isActive = false;             
      //   this.adDetailErrorMsg = "User is not a member of VS_CFO or VS_CFOManager group";
      // }
      
    })
  }

  saveCfo(){ 
    var vcfoId, vcfoEmail;  
    vcfoId = this.openFor === "Add" ? 0 : this.vcfoDetails.vcfoId;
    vcfoEmail = this.openFor === "Add" ? this.userSearched.data.email: "";
    var request = {
      "adUsername": this.vcfoDetails.username,
      "role": this.vcfoDetails.role,
      "fullName": this.vcfoDetails.fullname,
      "username":this.currentUser.userName,
      "isActive": this.vcfoDetails.isActive,
      "vcfoId": vcfoId,
      "email": this.userSearched.data.email
    }
    //console.log(request);
    this.advisorservice.saveHomeOfficeUser(request).subscribe(data => {
      if(data["status"] = "success"){
        this.updatevcfo.emit("true");
        this.bsModalRef.hide();
      }
    })
  }

  editCfo(){
    //if(this.vcfoDetails.reassignedRepId !== undefined){
     // this.enableSaveBtn = false;
      var repList = [];
      if (this.isCFORoleChanged) {     
        this.selectedAdvisor.forEach(element => {
          repList.push(element.repId);
        })
      this.vcfoDetails.repIdList = repList.join(",");        
      }
      else { 
        if(this.selectedAdvisor.length > 0){
          this.selectedAdvisor.forEach(element => {
            repList.push(element.repId);
          })
          this.vcfoDetails.repIdList = repList.join(","); 
        }
        else{
          this.vcfoDetails.repIdList = null;
        }
      }
      var request = {
        "id": this.vcfoDetails.vcfoId,
        "adUsername": this.vcfoDetails.username,
        "role": this.vcfoDetails.role,
        "fullName": this.vcfoDetails.fullname,
        "username": this.currentUser.userName,
        "isActive": this.vcfoDetails.isActive,
        "vcfoId": this.vcfoDetails.reassignedRepId,
        "repIdList": this.vcfoDetails.repIdList,
        "email": this.vcfoDetails.email
      }
      //console.log(request);

      this.advisorservice.saveHomeOfficeUser(request).subscribe(data => {
        if(data["status"] = "success"){
          this.updatevcfo.emit("true");
          this.bsModalRef.hide();
        }
      });
    //}
    // else{
    //   this.enableSaveBtn = true;
    // }
    
  }

  ngOnInit() {
    if(this.openFor === 'Add'){
      //this.vcfoDetails.role = "CFO";
      this.vcfoDetails.isActive = true;
      this.checkDuplicateCFO = JSON.parse(JSON.stringify(this.cfosData));
      // this.advisorservice.getAdDetail(this.vcfoDetails.username).subscribe(data => {
      //   this.adData = data["data"];             
                
      // })
    }
    
    if(this.openFor === 'Edit'){
      this.vcfoDetails = Object.assign({}, this.vcfoDetail);
      this.enableSave = false;
      this.advisorservice.getAdvisorsByVcfoId(this.vcfoDetails.vcfoId).subscribe(data => {
        this.advisorList = data["data"];
        //console.log(this.advisorList);
      })

      this.advisorservice.getAdDetail(this.vcfoDetails.username).subscribe(data => {
          var adData = data["data"];
          if (adData.hasErrors === false) {
              this.vcfoDetails.email = adData.email;
              if (adData.groups && adData.groups.indexOf(this.vcfoAdManagerGroup) >= 0) {
                this.vcfoDetails.role = this.adGroup.vcfoManager.text;
                  if (this.vcfoDetails.role == 'CFO' || this.vcfoDetails.role == 'Analyst'|| this.vcfoDetails.role != this.vcfoDetail.role) {
                      this.isCFORoleChanged = true;
                      //if(this.advisorList.length > 0){
                        this.reassignWarningMessage = true;
                    //}
                    //this.warningMessages = [];
                    //this.warningMessages.push({ msg: 'Warning! All the advisors under this user need to reassigned to other CFO ' });
                    //isValid = true;
                }
              }
              else if (adData.groups && adData.groups.indexOf(this.vcfoAdGroup) >= 0)
                  this.vcfoDetails.role = this.adGroup.vcfo.text;
              else if (adData.groups && adData.groups.indexOf(this.vcfoAdAnalystGroup) >= 0)
                  this.vcfoDetails.role = this.adGroup.analyst.text;
              else{
                //this.vcfoDetails.role = "";   
                this.vcfoDetails.isActive = false;             
                this.adDetailErrorMsg = "User is not a member of VS_CFO or VS_CFOManager or VS_CFOAnalyst group";
              }
                
          }
          else {
              this.adDetailErrorMsg = adData.message;
              this.vcfoDetails.fullname = "";
              this.vcfoDetails.role = "";
          }  
           
      })

      this.dataSource = Observable.create((observer: Observer<string>) => observer.next(this.reassignCFO))
      .pipe(mergeMap((token: string) => this.advisorservice.searchVcfos(token)));

      // this.advisorservice.getAdvisorsByVcfoId(this.vcfoDetails.vcfoId).subscribe(data => {
      //   this.advisorList = data["data"];
      //   //console.log(this.advisorList);
      // })      
    }
  }

}
