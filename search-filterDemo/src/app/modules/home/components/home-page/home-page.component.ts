import { Component, OnInit,ViewChild, AfterViewInit,DoCheck,ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import {HomeService } from '../../services/home.service'
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { UserInfo } from  '../../../_shared/services/userInfo.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddTaskComponent } from '../../../_shared/components/add-task/add-task.component';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ViewNotificationsComponent } from '../view-notifications/view-notifications.component';
import { ADMIN, GUEST } from 'src/app/modules/_shared/constants/global.constant';
import { CommunicationService } from 'src/app/modules/_shared/services/communication.services';
 
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers : [HomeService,DatePipe]
})
export class HomePageComponent implements OnInit, AfterViewInit,DoCheck  {
  @ViewChild('fromDate', {static: true}) fromDate:any;
  @ViewChild('toDate', {static: true}) toDate:any;
  @ViewChild('gridContainer1', { static: false }) gridContainer1: DxDataGridComponent;
  @ViewChild('gridContainer2', { static: false }) gridContainer2: DxDataGridComponent;
  public showHeaderFilter : boolean = true;
  public totalCount : number;
  public totalCountNames : string;
  public totalCountName : string;
  public advisiorDetail:any = [];
  public myAdvisor:any = [];
  public myAdvisorDetail:any = [];
  public myTask:any = [];
  public repItemStorage: any =[];
  public param :any;
  public gridType: string ='';
  public dueDate: any = {from:'',to:''};
  public isHide : boolean = true;
  public currentUser: any;
  public bsModalRef : BsModalRef;
  public customFilterData : any = {};
  public filterData: any={};
  public CurrentViewIdentifier: any;
  public norificationList : any;
  public notificationCount : number;
  public currentView : string = 'T';
  public guest : string = GUEST;
  public admin : string = ADMIN;
  public userType : any;
  public searchText: any ="";

  dataSource: any = {};
  constructor(private communicationService : CommunicationService, private service : HomeService,private datePipe: DatePipe,private userinfo : UserInfo, private modalService : BsModalService, private changeDetector : ChangeDetectorRef) {
    
  }
  public switchView: boolean = true;
  ngOnInit() {
    this.communicationService.getAccessType().subscribe( userType => this.userType = userType);
    this.totalCount = 0;
    this.gridType = 'alladvisor';
    this.totalCountName = this.gridType;
    this.currentUser = this.userinfo._currentUserFn();
    this.gridIntialize();
  } 

  searchAdvisor(){
    //this.gridContainer.instance.refresh();
    if(this.gridType == "alladvisor" || this.gridType == "myadvisor"){
      this.gridContainer1.instance.refresh();
    }
    else{
      this.gridContainer2.instance.refresh();
    }    
  }

  gridIntialize(){
    if(this.gridType == "alladvisor"){
      this.totalCountNames = 'Advisors';
      this.totalCountName = 'Advisor';
      this.CurrentViewIdentifier = 3;
      this.filterData = {'advisor':'','repid':'','vcfo':''};
      this.headerFilterData();
    } 
    else if(this.gridType == "myadvisor"){
      this.filterData = {'advisor':'','repid':'','vcfo':''};
      this.totalCountNames = 'Advisors';
      this.totalCountName = 'Advisor';
      this.CurrentViewIdentifier = 2;
      this.headerFilterData();
    }
    else if(this.gridType == "mytask"){
      this.totalCountNames = 'Tasks';
      this.totalCountName = 'Task';
      this.CurrentViewIdentifier = 1;
      this.filterData = {'goal':'','status':'','advisor':''};
      this.headerFilterData();
    }
    
    this.dataSource.store = new CustomStore({
        key: "repid",
        load: (loadOptions: any) => {
         let param = this.generateParameter(loadOptions);
          return new Promise((resolve) => {
            this.service.getData(param).subscribe( result => {
                  let data = result['data'];
                  this.totalCount = data['totalCount'];
                  this.advisiorDetail = data['taskList'];
                  this.norificationList = data['unreadNotes'];
                  this.notificationCount = data['totalNotificationCount'];
                  //this.norificationList = [{"actionPlanId":4,"ActionPlanDetailId":401,"task":"test task s sdfa","goalId":1005,"goal":"Understand available financing options and utilize when needed","category":"Capital Solutions","categoryId":103,"totalNotes":6},{"actionPlanId":4,"ActionPlanDetailId":411,"task":"tst ajdfsdjkgfkw","goalId":1000,"goal":"Determine impacts of brokerage to advisory conversions","category":"Asset Conversions","categoryId":100,"totalNotes":1},{"actionPlanId":4,"ActionPlanDetailId":401,"task":"test task s sdfa","goalId":1005,"goal":"Understand available financing options and utilize when needed","category":"Capital Solutions","categoryId":103,"totalNotes":6},{"actionPlanId":4,"ActionPlanDetailId":411,"task":"tst ajdfsdjkgfkw","goalId":1000,"goal":"Determine impacts of brokerage to advisory conversions","category":"Asset Conversions","categoryId":100,"totalNotes":1}];
                  //this.notificationCount = 2;
                  resolve({
                    data:  (this.gridType == "alladvisor" || this.gridType == "myadvisor")?data['advisorList']:data['taskList'],  
                    totalCount: data['totalCount']
                  });
            }); 
          });  
        }
      });
      if(this.gridType == "alladvisor" || this.gridType == "myadvisor"){
        setTimeout(() => {
          this.gridContainer1.instance.clearFilter(); 
          this.gridContainer1.instance['_options'].dataSource.store['_key']='repid';
          this.gridContainer1.instance.refresh().then(()=>{
            this.repItemStorage = [];
            //this.gridContainer1.instance.collapseAll(-1);
          })
          .catch((error) => {
          });
          
        }, 0);
      }else{
        setTimeout(() => {
          this.gridContainer2.instance['_options'].dataSource.store['_key']='';
          this.changeDetector.detectChanges();
          this.gridContainer2.instance.refresh();}, 0);
      }    
  }
  ngAfterViewInit(){}

  ngDoCheck() {}
  
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
                    "viewId": _self.CurrentViewIdentifier,
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

  calculateFilterExpressionOAS(filterValue, selectedFilterOperation) {
    return ["overallstatus", filterValue];
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
      "CurrentViewIdentifier":this.CurrentViewIdentifier,
      "CurrentPageNumber":this.getPageNumber(loadOptions),
      "PageSize":15,
      "OrderByColumns":orderByColumns,
      "GridDataFilter":this.transformFilterData(loadOptions),
      "username":this.currentUser.userName,
      "searchString":this.searchText,
      "fromDate":"",
      "toDate":""
    };

    if(this.dueDate.from !='' && this.dueDate.to!=''){
      param.fromDate = this.dueDate.from;
      param.toDate = this.dueDate.to;
    }
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
        if (val && col && f.columnIndex >= 0) {
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

  onValueChange(type,event) {
    this.isHide = false;
    let format = 'yyyy-MM-ddTHH:mm:SS.SSS';
    if(type=='from' || type=='to'){
      this.dueDate[type] = this.datePipe.transform(event, format,'UTC');
      if(type=='from') this.toDate.minDate = event;  
      if(type=='to') this.fromDate.maxDate = event;
    }
    
    if(this.dueDate.from !='' && this.dueDate.to!=''){
        this.gridIntialize();
    }
  }

  clearDates(){
    //this.fromDate.bsValue= undefined;
    //this.toDate.bsValue = undefined;
    this.isHide = true;
    this.searchText = '';
    this.dueDate= {from:'',to:''};
    this.gridIntialize();
  }

  navHandler(cevent){ 
    this.gridType = cevent.type;
    this.changeDetector.detectChanges();
    this.clearDates();
  }

  getTasks(key) {
      let item = this.repItemStorage.find((i) => i.key === key);
      if (!item) {
          item = {
              key: key,
              dataSourceInstance: new DataSource({
                  store: new ArrayStore({
                      data: JSON.parse(JSON.stringify(this.advisiorDetail)),
                      key: "actionPlanId"
                  }),
                  filter: ["repId", "=", key]
              })
          };
          this.repItemStorage.push(item)
      }
      return item.dataSourceInstance;
    }

    editTask(data){
      // this.repItemStorage = [];     
      let row = data.data;
      let initialState = {
        currentUser : this.currentUser,
        taskData: data.data,
        title: 'Edit Task',
        goalDetail : {},
        openFrom : 'home-page',
        userType: this.userType,
      };
      
      this.bsModalRef = this.modalService.show(AddTaskComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.taskSavedHome.subscribe(value => {
       
        if(this.gridType == "alladvisor" || this.gridType == "myadvisor"){
          this.gridContainer1.instance.refresh().then(()=>{
            this.repItemStorage = [];                   
          }) 
        }
        else{
          this.gridContainer2.instance.refresh().then(()=>{
            this.repItemStorage = [];              
          }) 
        }
      })
    }


    viewNotification(){
      if(this.notificationCount > 0){
        //this.notificationCount = 0;
        let initialState = {
          currentUser : this.currentUser,
          notificationList: this.norificationList,
          title: 'View Notifications'
        };

        this.bsModalRef = this.modalService.show(ViewNotificationsComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.readNote.subscribe(value => {
          if(value === 'true'){
            this.gridIntialize();
          }
        })
      }
    }

    switchViewFunc(currView){
      if(this.currentView != currView){
        this.currentView = currView;
        this.switchView = !this.switchView;
      }
      
    }
}


