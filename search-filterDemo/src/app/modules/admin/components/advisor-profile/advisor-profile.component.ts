import { Component, OnInit,ViewChild,AfterViewInit,DoCheck,ChangeDetectorRef } from '@angular/core';
import {AdvisorService } from '../../services/advisor.service'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddAdvisorComponent } from '../../../_shared/components/add-advisor/add-advisor.component';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { UserInfo } from  '../../../_shared/services/userInfo.service';
import { CommunicationService } from '../../../_shared/services/communication.services';
import { AppSettings, CW_IMAGE_URL } from '../../../_shared/constants/api-constant';
import excelExporter from 'devextreme/exporter/exceljs/excelExporter';
//import  * as ExcelJS from 'exceljs';
//import saveAs from 'file-saver';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { map } from 'rxjs/operators';
import { ConfirmModalComponent } from 'src/app/modules/_shared/components/confirm-modal/confirm-modal.component';
import { createTokenForExternalReference } from '@angular/compiler/src/identifiers';

@Component({
  selector: 'advisor-profile',
  templateUrl: './advisor-profile.component.html',
  styleUrls: ['./advisor-profile.component.scss'],
  providers : [AdvisorService]
})
export class AdvisorProfileComponent implements OnInit {
  @ViewChild('gridContainer', { static: false }) gridContainer: DxDataGridComponent;
  public bsModalRef : BsModalRef;
  public showHeaderFilter : boolean = true;
  public advisorProfile:any = [];
  public advisorProfileDetails:any = [];
  public param : any;
  public repItemStorage: any =[];
  public totalCount : number;
  public showAdvisorSubsriptionForm : boolean = false;
  public editFormData : any;
  public customFilterData : any = {};
  public filterData: any;
  public CurrentViewIdentifier: any;
  public dataSource: any = {};
  public currentUser: any;
  public isactive : boolean;
 public splitAdvisors :any = [];
 public advisors :any = [];
  public cwAccessFlag : boolean = true;

  public advisorDetailList: any = [];
  public masterAdvsiorDetail : any = [];
  public splitAdvsiorDetail : any = [];
  public searchText: any ="";
  public userRole : any;
  public cfoManager = AppSettings.adGroup.vcfoManager;
  public cfo = AppSettings.adGroup.vcfo;
  public analyst = AppSettings.adGroup.cfoAnalyst;
    public checkedAdvisors: any = [];
    public unCheckedAdvisors: any = [];
    public disableCwAccessButton: boolean = false;
  vcfoArr : any;
  public selectedMasterdet : any;
  public actionReq : boolean = false;

  constructor(private service : AdvisorService,private modalService : BsModalService,private userinfo : UserInfo,private changeDetector : ChangeDetectorRef, private communicationService : CommunicationService) { }

  ngOnInit() {
    this.totalCount = 0;
    this.currentUser = this.userinfo._currentUserFn();
    this.currentUser.groups.forEach(value => {
      if (value.name.toLowerCase() == this.cfo.toLowerCase() ) {
     this.userRole = AppSettings.adGroup.vcfo;
     //this.userRole = AppSettings.adGroup.vcfoManager;
      }
      else if (value.name.toLowerCase() == this.cfoManager.toLowerCase()) {
        this.userRole = AppSettings.adGroup.vcfoManager;
      }
      else if (value.name.toLowerCase() == this.analyst.toLowerCase()) {
        this.userRole = AppSettings.adGroup.cfoAnalyst;
      }
    });
    this.filterData = {'advisor':'','repId':'','vcfo':'','isactive':true};
    this.loadGridData();
  }

  getValue(masterAdvisor){
    this.selectedMasterdet = masterAdvisor.data;
    this.selectedMasterdet.changedData = true;
    this.checkedAdvisors= [];
    let secondaryAdvisor;
    var sAdvisor; 
    this.communicationService.getSplitAdvisor().subscribe(response => {
      secondaryAdvisor = response;
      secondaryAdvisor.forEach(item => {
         sAdvisor = secondaryAdvisor.filter(item => item.masterId === masterAdvisor.key);
      });
    })
   
    //let secondaryAdvisor = this.getTasks(masterAdvisor.key, 'func');
    if(masterAdvisor.data.cwAccess === false){
      sAdvisor.forEach(element => {        
        // if((element.IsMaster === 1 && element.IsPrimaryMaster === 0) && (element.ASATEmailTrigger === "0" || element.ASATEmailTrigger === "3" || element.ASATEmailTrigger === "4")) {
        //   element.ASATEmailTrigger = "2";
        //   element.cwAccess = 1;
        //   this.checkedAdvisors.push(element);
        // } 
          
        if(element.cwAccess === 1 ){
          var splitElement = Object.assign({}, element)
          splitElement.ASATEmailTrigger = "2";
          splitElement.cwAccess = 1;
          this.checkedAdvisors.push(splitElement);
        }          
        //element.cwAccess = 0;
        
      });

      this.advisorProfileDetails.forEach(element => {
        sAdvisor.forEach(elementChecked => {
          if(elementChecked.repid === element.repid){
            element = elementChecked
          }
        });
      });
      this.changeDetector.detectChanges();
      this.repItemStorage = [];
      this.getTasks(masterAdvisor.repId, 'grid');

      //console.log(this.checkedAdvisors)
    }
    else{
      this.checkedAdvisors = [];
    }
    
  }
  
  selectedAdvisor(advDet, masterDet){ 
    var repExist = false;  
    advDet.changedData = true;    
    if(advDet.cwAccess === true){
      if(advDet.IsSharedMaster === 1){

        let initialState = {
          title: 'Change Action Plan',
          confirmTxt: 'This RepId already has access to another action plan, do you need to change it?'
          };
          
          this.bsModalRef = this.modalService.show(ConfirmModalComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
          this.bsModalRef.content.closeBtnName = 'Close';
          this.bsModalRef.content.confirm.subscribe(value => {
            if (value === "true"){             
              if(this.checkedAdvisors.length > 0){     
                this.checkedAdvisors.forEach(element => {
                  if(element.repid === advDet.repid){
                    repExist = true;
                  }
                  
                });
              }
              else{
                repExist = false;
              }
              if(repExist === false){
                advDet.actionPlanId = this.selectedMasterdet.actionPlanId
                this.checkedAdvisors.push(advDet);
              }
            }
            else{
              advDet.cwAccess = false;
            }
        })
      }  
      else{
        if(this.checkedAdvisors.length > 0){     
          this.checkedAdvisors.forEach(element => {
            if(element.repid === advDet.repid){
              repExist = true;
            }
            
          });
        }
        else{
          repExist = false;
        }
        if(repExist === false){
          if(advDet.ASATEmailTrigger !== '3'){
            this.checkedAdvisors.push(advDet);
          }
          else{
            this.unCheckedAdvisors.forEach(element => {
              if(element.repid === advDet.repid){
                //repExist = true;
                this.unCheckedAdvisors=this.unCheckedAdvisors.filter(item => item.repid !== advDet.repid);
              }          
            });
          }
          
        }
      }    
    }
    else{
      // this.communicationService.getSplitAdvisor().subscribe(response => {
      //   this.splitAdvsiorDetail = JSON.parse(JSON.stringify(response));
      // });
      this.splitAdvsiorDetail = this.getTasks(masterDet.key, 'func');       
      
      this.splitAdvsiorDetail.forEach(element => {
        if((element.repid === advDet.repid) && (element.ASATEmailTrigger === '3')){
          
          if(this.unCheckedAdvisors.length > 0){     
            this.unCheckedAdvisors.forEach(element => {
              if(element.repid === advDet.repid){
                repExist = true;
                this.unCheckedAdvisors=this.unCheckedAdvisors.filter(item => item.repid !== advDet.repid);
              }          
            });

            if(repExist == false){
              this.unCheckedAdvisors.push(advDet);
            }
          } 
          else{
            this.unCheckedAdvisors.push(advDet);
          }          
         
        }
        else{
          if(this.checkedAdvisors.length > 0){     
              this.checkedAdvisors.forEach(element => {
                if(element.repid === advDet.repid){
                  this.checkedAdvisors=this.checkedAdvisors.filter(item => item.repid !== advDet.repid);
                }          
              });
            } 
        }
      });
         
    }
  }

  saveAsatChanges(dataAdvsior){ 
    var checkSecondaryAdvisor = false;
    if(this.unCheckedAdvisors.length > 0){
      this.unCheckedAdvisors.forEach(element => {
        this.unCheckedAdvisors = this.unCheckedAdvisors.filter(element => element.masterId === dataAdvsior.data.repId);      
      });
    }
    if(this.checkedAdvisors.length > 0){
      this.checkedAdvisors.forEach(element => {
        this.checkedAdvisors = this.checkedAdvisors.filter(element => element.masterId === dataAdvsior.data.repId);      
      });
    }
    this.communicationService.getMasterAdvisor().subscribe(response => {
      this.masterAdvsiorDetail = JSON.parse(JSON.stringify(response));
    })   
    
      let initialState = {
          title: 'Grant/Revoke ClientWorks Access',
          confirmTxt: 'Are you sure you want to grant/revoke CW Access.'
      };
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false, class: 'modal-lg' });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.confirm.subscribe(value => {
          if (value === 'true') {
            if(dataAdvsior.data.changedData === true){                      

            this.masterAdvsiorDetail.forEach(element => {
              if(element.repId === dataAdvsior.data.repId){
                if(dataAdvsior.data.ASATEmailTrigger === "3" && (dataAdvsior.data.cwAccess === 1 || dataAdvsior.data.cwAccess == true)){
                  dataAdvsior.data.cwAccess = 1;
                }
                else{
                  
                   if(element.cwAccess === 1 && dataAdvsior.data.cwAccess === false){
                    dataAdvsior.data.ASATEmailTrigger = "2";
                    dataAdvsior.data.cwAccess = 1;
                    checkSecondaryAdvisor = true;
                  }
                  else if(element.cwAccess === 0 && dataAdvsior.data.cwAccess === false){
                    //dataAdvsior.data.ASATEmailTrigger = "2";
                    //dataAdvsior.data.cwAccess = 1;
                    this.checkedAdvisors = [];
                    this.unCheckedAdvisors = [];
                  }
                  else {
                    dataAdvsior.data.ASATEmailTrigger = "1";
                    dataAdvsior.data.cwAccess = 0;
                  }
                }
               
              }
            });          
        
            if(checkSecondaryAdvisor === false){
              this.checkedAdvisors.forEach(element => {
                if(element.changedData === true){
                  element.ASATEmailTrigger = "1";
                  element.cwAccess = 0;                  
                }
                
              }); 
            }
        
            if(this.unCheckedAdvisors.length > 0){
              this.unCheckedAdvisors.forEach(element => {
                if(element.changedData === true){
                  element.ASATEmailTrigger = "2";
                  element.cwAccess = 1;
                  this.checkedAdvisors.push(element);
                }
              });
            }
          }
          else{
            if(checkSecondaryAdvisor === false){
              this.checkedAdvisors.forEach(element => {
                if(element.changedData === true){
                  element.ASATEmailTrigger = "1";
                  element.cwAccess = 0;                  
                }
                
              }); 
            }
        
            if(this.unCheckedAdvisors.length > 0){
              this.unCheckedAdvisors.forEach(element => {
                if(element.changedData === true){
                  element.ASATEmailTrigger = "2";
                  element.cwAccess = 1;
                  this.checkedAdvisors.push(element);
                }
              });
            }
          }
              var request = {};
              if (this.checkedAdvisors.length > 0) {
                  request = {
                      "username": this.currentUser.userName,
                      "repListJSON": {
                          "masterAdvisorList": [dataAdvsior.data],
                          "splitAdvisorList": this.checkedAdvisors
                      }
                  }
              }
              else {
                  request = {
                      "username": this.currentUser.userName,
                      "repListJSON": {
                          "masterAdvisorList": [dataAdvsior.data],
                          "splitAdvisorList": this.checkedAdvisors.length > 0 ? this.checkedAdvisors : []
                      }
                  }                 
              };
             
              this.service.saveAsatFlag(request).subscribe(data => {
                  this.disableCwAccessButton = true;
                  this.actionReq = true;
                  setTimeout(()=>{
                    this.actionReq = false;
                  }, 5000);
                  this.gridContainer.instance.refresh().then(()=>{
                      this.repItemStorage =[];
                      this.checkedAdvisors = [];
                      this.unCheckedAdvisors= [];                
                      this.disableCwAccessButton = false;                      
                  })                 
              })

              //console.log(request);
              
          }
      })
  };

  searchAdvisor(){
    this.gridContainer.instance.refresh();    
  }

  loadGridData(){
    this.headerFilterData();
    this.dataSource.store = new CustomStore({
      key: "repId",
      load: (loadOptions: any) => {
       let param = this.generateParameter(loadOptions);
        return new Promise((resolve) => {
          this.service.getData(param).subscribe( result => {
                let data = result['data'];
                this.totalCount = data['totalCount']>0?data['totalCount']:0;
                this.advisorProfileDetails = data['splitAdvisorList'];
                var masterAdvsiorDetail = JSON.parse(JSON.stringify(data['masterAdvisorList']));
                var splitAdvsiorDetail = JSON.parse(JSON.stringify(data['splitAdvisorList']));
                this.communicationService.setMasterAdvisor(masterAdvsiorDetail);
                this.communicationService.setSplitAdvisor(splitAdvsiorDetail);
                resolve({
                  data: data['masterAdvisorList'],
                  totalCount: data['totalCount']
                });

                //console.log(this.masterAdvsiorDetail);
          }); 
        });  
      }
    });
  }
  headerFilterData(){
    let _self= this;
    for (let obj in this.filterData) {
      this.filterData[obj] = new CustomStore({
          load: function(loadOptions) {
            return new Promise((resolve,reject) => {
              let parameters = {};
              let colName = loadOptions.filter;
              let result = [];
              let param = {
                  "columnName": obj,
                  "username": _self.currentUser.userName
              };
              _self.service.getFilters(param).subscribe((rsp) => {
               
                  if (result['status'] = "success") {
                    let temp = rsp['data'];
                    temp.forEach((obj)=> {
                        result.push({
                            text: obj.value,
                            value: obj.id
                        });
                    });
                    resolve({ data: result, totalCount: temp['totalCount']});
                  }
              }); 
            });
        }
      });
  };
}
calculateFilterExpression(filterValue, selectedFilterOperation) {
  return ["repid", filterValue];
}


generateParameter(loadOptions){
  let orderByColumns = [];
  let parameters = {'orderby':'','sortOrder':0};
  if (loadOptions.sort) {
      parameters.orderby = loadOptions.sort[0].selector;
      parameters.sortOrder = loadOptions.sort[0].desc ? 1 : 0;
      orderByColumns.push({
          "ColumnName": parameters.orderby,
          "SortOrder": parameters.sortOrder,
          "Sequence": 1
      });
  };

  let param = {
    "CurrentPageNumber":this.getPageNumber(loadOptions),
    "PageSize":15,
    "OrderByColumns":orderByColumns,
    "GridDataFilter":this.transformFilterData(loadOptions),
    "SearchString":this.searchText
  }; 

  return param;
}

getPageNumber(loadOptions){
  let pageNumber =  (loadOptions.skip === 0) ? 1 : ((loadOptions.skip + loadOptions.take) / loadOptions.take);
  if(isNaN(pageNumber)) pageNumber=1;
  return pageNumber;
}

createCustomFilter (f) {
    if (f != "or" && f != "and") {
        //let val = f[1];
        let val = f['filterValue'];
        let col = f[0];
        if (col == "isactive") {
          val = f['filterValue'] ? 1 : 0;
              if (val>=0 && col && f.columnIndex >= 0) {
                  if (this.customFilterData[col] && this.customFilterData[col].value && this.customFilterData[col].value.indexOf(val) < 0) {
                    this.customFilterData[col].value.push(val);
                  }
                  else {
                    this.customFilterData[col] = {
                          "value": [val]
                      }
                  }
              }
          }

       else if (val && col && f.columnIndex >= 0) {
            if (this.customFilterData[col] && this.customFilterData[col].value && this.customFilterData[col].value.indexOf(val) < 0) {
                this.customFilterData[col].value.push(val);
            }
            else {
                this.customFilterData[col] = {
                    "value": [val]
                }
            }
        }
    } 
}

transformFilterData(loadOptions){
  this.customFilterData = {};
  if (loadOptions.filter && loadOptions.filter.length > 0) {
    if (loadOptions.filter[1] == "and") {
        loadOptions.filter.forEach((f) => {
            if (f[1] == "or") {
              f.forEach((g) => {
                this.createCustomFilter(g);
              });
            } else {
                this.createCustomFilter(f)
            }
        })
    }
    else {
        if (loadOptions.filter[1] == "or") {
            loadOptions.filter.forEach((f) => {
                this.createCustomFilter(f)
            });
        }
        else {
            this.createCustomFilter(loadOptions.filter);
        }
    }
}

let GridDataFilter = {
  ColumnFilterList: []
}
for (let i in this.customFilterData) {
    GridDataFilter.ColumnFilterList.push({
        "Name": i,
        "ValueFilter": this.customFilterData[i].value
    })
}
return GridDataFilter;
}


  showEditForm(gridData){
    var advisorProfiles = [];
    if(gridData.openFrom === "Add Advisor"){
      if(gridData.secondaryrepids.length > 0){
        gridData.secondaryrepids.forEach(val => {
            advisorProfiles.push({
           'ASATemailTrigger': val.nonPrimaryMasterRep ? "1" : "0",          
          'IsMaster': val.IsMaster ? val.IsMaster : 0,
          'IsPrimaryMaster': val.IsPrimaryMaster ? val.IsPrimaryMaster : 0,
          'actionPlanId': null,
          'email': val.email ? val.email : null,
          'fullname': val.name ? val.name : null,
          'isActive': val.cwAccess ? val.cwAccess : false,
          'includeId': val.includeId ? val.includeId : false,
                'ownershipPercentage': val.ownership ? val.ownership:0,
              'repid': val.repid ? val.repid : false,
              'nonPrimaryMasterRep': val.nonPrimaryMasterRep ? val.nonPrimaryMasterRep : null,
              'firstName': val.firstName ? val.firstName : null,
              'middleName': val.middleName ? val.middleName : null,
                'lastName': val.lastName ? val.lastName : null,
              
              'repUserName': val.repUserName ? val.repUserName : null});
        });
      }
      let gridRowData = {
        'ASATemailTrigger': "0",
        'actionPlanId': null,
        'contractEndDate': null,
        'contractStartDate': null,
        'email': gridData.primaryrepid.email ? gridData.primaryrepid.email : null,
        'fullname': gridData.primaryrepid.name ? gridData.primaryrepid.name : null,
        'isActive': 0,
        'otherOutsideAum': gridData.primaryrepid.otherOutsideAum ? gridData.primaryrepid.otherOutsideAum : null,
        'outsideAdvisoryRev': gridData.primaryrepid.outsideAdvisoryRev ? gridData.primaryrepid.outsideAdvisoryRev : null,
        'outsideBrokerageRev': gridData.primaryrepid.outsideBrokerageRev ? gridData.primaryrepid.outsideBrokerageRev : null,
        'includeId': gridData.primaryrepid.includeId ? gridData.primaryrepid.includeId : false,
        'ownershipPercentage': gridData.primaryrepid.ownershipPercentage ? gridData.primaryrepid.ownershipPercentage : 100,
          'primaryMasterUsername': gridData.primaryrepid.primaryMasterUsername ? gridData.primaryrepid.primaryMasterUsername : null,
          'repUserName': gridData.primaryrepid.repUserName ? gridData.primaryrepid.repUserName : null,
        'repid': gridData.primaryrepid.repid ? gridData.primaryrepid.repid : null,
        'tampAum': gridData.primaryrepid.tampAum ? gridData.primaryrepid.tampAum : null,
        'token': "add",
        'vcfo' : null,
        'vcfoId' : null,
          'secondaryRepids': advisorProfiles,
          'firstName': gridData.primaryrepid.firstName ? gridData.primaryrepid.firstName : null,
          'middleName': gridData.primaryrepid.middleName ? gridData.primaryrepid.middleName : null,
          'lastName': gridData.primaryrepid.lastName ? gridData.primaryrepid.lastName : null,
        'username': this.currentUser.userName
      };
      this.editFormData = {repId:gridData.repid,vcfoName:gridData.data, 'subscriptionObject' : gridRowData};
      this.showAdvisorSubsriptionForm = true;
    }
    else{
      let advisorProfilesArr = this.advisorProfileDetails.filter((val) => val.masterId == gridData.key);
      var advisorProfiles = [];
      advisorProfilesArr.forEach(val => {
        advisorProfiles.push({'ASATemailTrigger': val.ASATEmailTrigger ? val.ASATEmailTrigger : "0",
        'IsMaster': val.IsMaster ? val.IsMaster : 0,
        'IsPrimaryMaster': val.IsPrimaryMaster ? val.IsPrimaryMaster : 0,
        'actionPlanId': val.actionPlanId ? val.actionPlanId : null,
        'email': val.email ? val.email : null,
        'fullname': val.advisor ? val.advisor : null,
        'isActive': val.cwAccess ? val.cwAccess : false,
        'includeId': val.includeId ? val.includeId : false,
        'ownershipPercentage': val.ownership ,
            'repid': val.repid ? val.repid : null
            //'nonPrimaryMasterRep': val.nonPrimaryMasterRep ? val.nonPrimaryMasterRep : null,
            //'firstName': val.firstName ? val.firstName : null,
            //'middleName': val.middleName ? val.middleName : null,
            //'lastName': val.lastName ? val.lastName : null,
            //'repUserName': val.repUserName ? val.repUserName : null
        });
      });
      
      //let gridRowData = gridData.data;
      //gridRowData['secondaryRepids'] = advisorProfilesArr;
      //let subscriptionObject = {'gridRowData' : gridRowData, 'advisorProfilesArr' : advisorProfilesArr};
      //var vcfoArr;
      this.communicationService.getCFO().subscribe( (vcfoArr => this.vcfoArr = vcfoArr) )
      //console.log(this.vcfoArr);
      var myvcfo = this.vcfoArr !== null ? this.vcfoArr.filter(val => val.fullname == gridData.data.vcfo) : [];
      let gridRowData = {
        'ASATemailTrigger': gridData.data.ASATEmailTrigger ? gridData.data.ASATEmailTrigger : "0",
        'actionPlanId': gridData.data.actionPlanId ? gridData.data.actionPlanId : null,
        'contractEndDate': gridData.data.contractenddate ? gridData.data.contractenddate : null,
        'contractStartDate': gridData.data.contractstartdate ? gridData.data.contractstartdate : null,
        'email': gridData.data.email ? gridData.data.email : null,
        'fullname': gridData.data.advisor ? gridData.data.advisor : null,
        'isActive': gridData.data.cwAccess ? gridData.data.cwAccess : 0,
        'otherOutsideAum': gridData.data.otherOutsideAum ? gridData.data.otherOutsideAum : null,
          'outsideAdvisoryRev': gridData.data.outsideAdvisoryRev ? gridData.data.outsideAdvisoryRev : null,
          'outsideBrokerageRev': gridData.data.outsideBrokerageRev ? gridData.data.outsideBrokerageRev : null,
          'includeId': gridData.data.includeId ? gridData.data.includeId : false,
          'ownershipPercentage': gridData.data.ownershippercentage,
          'primaryMasterUsername': gridData.data.primaryMasterUsername ? gridData.data.primaryMasterUsername : null,
          'repUserName': gridData.data.repUserName ? gridData.data.repUserName : null,
        'repid': gridData.data.repId ? gridData.data.repId : null,
          'tampAum': gridData.data.tampAum ? gridData.data.tampAum : null,
        'token': "",
        'vcfo' : gridData.data.vcfoname ? gridData.data.vcfoname : null,
          'vcfoId': gridData.data.VCFOId  ? gridData.data.VCFOId  : null,
          //'firstName': gridData.primaryrepid.firstName ? gridData.primaryrepid.firstName : null,
          //'middleName': gridData.primaryrepid.middleName ? gridData.primaryrepid.middleName : null,
          //'lastName': gridData.primaryrepid.lastName ? gridData.primaryrepid.lastName : null,
        'secondaryRepids' : advisorProfiles
      };
      this.editFormData = {repId:gridData.data.repId,vcfoName:gridData.data.vcfo, 'subscriptionObject' : gridRowData};
      this.showAdvisorSubsriptionForm = true;
    }
  }

  subscriptionHandler(event){
    if(event.cancel==true){
      this.showAdvisorSubsriptionForm = false;
    }
    if(event.save==true){
      this.showAdvisorSubsriptionForm = false;
      this.repItemStorage =[];
      this.loadGridData();
    }
  }
  
  getTasks(key,type) {
    let item = this.repItemStorage.find((i) => i.key === key);
    if (!item) {
        item = {
            key: key,
            dataSourceInstance: new DataSource({
                store: new ArrayStore({
                    data: JSON.parse(JSON.stringify(this.advisorProfileDetails)),
                    key: "masterId"
                }),
                filter: ["masterId", "=", key]
            })
        };
        this.repItemStorage.push(item)
    }
    this.advisorDetailList = item.dataSourceInstance._items;
    item.dataSourceInstance._items.forEach(element => {     
      // if(element.IsPrimaryMaster === 1){
      //   element.cwAccess = false;
      //   element.cwAccessFlag = false;
      // }
      if((element.IsMaster === 1 && element.IsPrimaryMaster === 0 ) && (element.ASATEmailTrigger === "0" || element.ASATEmailTrigger === "3" || element.ASATEmailTrigger === "4")){
        element.cwAccessFlag = true;       
      }
      if((element.IsMaster === 1 && element.IsPrimaryMaster === 0 ) && (element.ASATEmailTrigger === "1" || element.ASATEmailTrigger === "2")){
        element.cwAccessFlag = false;
      }
      // if(element.IsMaster === 0 && element.IsPrimaryMaster === 0){
      //   element.cwAccess = false;
      //   element.cwAccessFlag = false;
      // }
      
      if(element.IsPrimaryMaster === 0){
        if(element.IsMaster === 1){
          element.hidden = false;
        }        
        //element.cwAccessFlag = false;        
      }
      if(element.IsMaster === 0 || element.IsPrimaryMaster === 1){
        //element.cwAccess = false;
        element.cwAccessFlag = false;
        element.hidden = true;
      }
    });
    if(type === 'grid'){
      return item.dataSourceInstance;
    }
    else{
      return this.advisorDetailList;
    }
    
  }

  addAdvisor(){
    let initialState = {
      title: 'Add Advisor'
    };
    
    this.bsModalRef = this.modalService.show(AddAdvisorComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.advisorSaved.subscribe(value => {
      if(value){
        value.openFrom = "Add Advisor"
        this.showEditForm(value);
      }
    })
  }  

  onExporting(e) {
    let ttlCnt = this.totalCount;
    let gridParameters = {
        "CurrentPageNumber": 1,
        "PageSize": ttlCnt,
        "OrderByColumns": [],
        "GridDataFilter": {
            "ColumnFilterList": []
        },
        "SearchString": ''
    }; 
    
    this.service.getData(gridParameters).subscribe((rsp) => {
        if (rsp && rsp['data']) {
            let data = rsp['data'];
            let advisors = data['masterAdvisorList'];
            let splitAdvisors = data['splitAdvisorList'];
            advisors.forEach(element => {
              element.cwAccess = (element.cwAccess === 0) ? false : true;
            });
            splitAdvisors.forEach(element => {
              element.cwAccess = (element.cwAccess === 0) ? false : true;
            });
            this.excelGeneration(advisors, splitAdvisors);
        } 
    });    
  }
    excelGeneration(padvisors, psplitAdvisors) {

        let options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: false,
            showTitle: false,
            useBom: true,
            noDownload: false,
            headers: ['Full Name', 'REP ID', 'MASTER ID', 'Include ID', 'Ownership Percentage', 'Outside Advisory Revenue', 'Outside Brokerage Revenue', 'TAMP AUM', 'Other Outside AUM', 'CFO', 'Contract Start Date', 'Is Active','CW Access Status']
        };
        var advisors = [];
        padvisors.forEach((value) => {
            var row1 = { advisor: value['advisor'], repId: value['repId'], masterId: value['repId'], includeId: value['includeId'], ownership: value['ownershippercentage'], outsideAdvisoryRev: value['outsideAdvisoryRev'], outsideBrokerageRev: value['outsideBrokerageRev'], tampAum: value['tampAum'], otherOutsideAum: value['otherOutsideAum'], vcfo: value['vcfo'], contractstartdate: this.getDateInFormat(value['contractstartdate']), cwAccess: value['cwAccess'], cwAccessStatus: value['cwAccessStatus'] };
            advisors.push(row1);

            let splitAdvisors = psplitAdvisors.filter((result) => {
                return row1['repId'] == result['masterId'];
            });
            if (splitAdvisors.length > 0) {
                splitAdvisors.forEach((svalue) => {
                    var row = { advisor: svalue['advisor'], repid: svalue['repid'], masterId: svalue['masterId'], includeId: svalue['includeId'], ownership: svalue['ownership'], outsideAdvisoryRev: '', outsideBrokerageRev: '', tampAum: '', otherOutsideAum: '', vcfo: '', contractstartdate: '', cwAccess: svalue['cwAccess'], cwAccessStatus: svalue['cwAccessStatus']  };
                    advisors.push(row);
                });
            }
        });

        new ngxCsv(advisors, 'Rep ID Report.xlsx', options);
    //let workbook = new ExcelJS.Workbook();
    //let worksheet = workbook.addWorksheet('sheet', {
    //    pageSetup: { paperSize: 9, orientation: 'landscape' },
    //});
    //let row = worksheet.addRow(['Full Name', 'REP ID', 'MASTER ID', 'Ownership Percentage', 'Outside Advisory Revenue', 'Outside Brokerage Revenue', 'TAMP AUM', 'Other Outside AUM','CFO', 'Contract Start Date', 'Is Active']);
    //let i=1;
    //let aRow:any = row.values;
    //aRow.forEach((value) => {
    //  let col = worksheet.getRow(1).getCell(i);
    //  worksheet.getCell(col['_address']).fill = {
    //    type: 'pattern',
    //    pattern:'solid',
    //    fgColor:{argb:'FFD3D3D3'},
    //  };
    //   worksheet.getColumn(i).width = value.length + 15;
    //    i++;
    //});
    
    //padvisors.forEach((value) => {
    //    let row1 = worksheet.addRow([value['advisor'], value['repId'], value['repId'], value['ownershippercentage'], value['outsideAdvisoryRev'], value['outsideBrokerageRev'], value['tampAum'], value['otherOutsideAum'], value['vcfo'],this.getDateInFormat(value['contractstartdate']),  value['cwAccess']]);
    //    let splitAdvisors = psplitAdvisors.filter((result) => {
    //        return value['repId'] == result['masterId'];
    //    });
    //    if (splitAdvisors.length > 0) {
    //        splitAdvisors.forEach((svalue) => {
    //            worksheet.addRow([svalue['advisor'], svalue['repid'], svalue['masterId'], svalue['ownership'], '', '', '', '', '','', svalue['cwAccess']] );
    //      });
    //    }
    //});
  
    //workbook.xlsx.writeBuffer().then(function (buffer) {
    //    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Rep ID Report.xlsx");
    //});
    this.gridContainer.instance.refresh();
  }

    getDateInFormat(date) {
      date = new Date(date);
      let dd = date.getDate();

      let mm = date.getMonth() + 1;
      let yyyy = date.getFullYear();
      if (dd < 10) {
          dd = '0' + dd;
      }

      if (mm < 10) {
          mm = '0' + mm;
      }

      date = mm + '/' + dd + '/' + yyyy;
      return date;
  }
}
