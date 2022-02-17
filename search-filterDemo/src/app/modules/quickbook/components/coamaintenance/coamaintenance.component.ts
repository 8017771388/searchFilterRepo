import { Component, OnInit } from '@angular/core';
import{AdvisorImporExportEntityResponse,AdvisorImportExportEntityDetails} from '../../../_shared/models/AdvisorImporExportEntityResponse'
import{QuickbookService} from '../../services/quickbook.service'
import { Observable } from 'rxjs';
import {ChartOfAccount,Account} from '../../../_shared/models/ChartOfAccount'
import { DxDataGridModule } from 'devextreme-angular';
import {CoaMasterDataResponse,Dropdown} from '../../../_shared/models/CoaMasterDataResponse'
import {COAmappingRequestModel,CoaMapping} from '../../../_shared/models/COAmappingRequestModel'

@Component({
  selector: 'app-coamaintenance',
  templateUrl: './coamaintenance.component.html',
  styleUrls: ['./coamaintenance.component.scss']
})
export class CoamaintenanceComponent implements OnInit {

  advisorimportresponse:AdvisorImporExportEntityResponse;
  selectedvalue: any="";
  selectedMSvalue: any="";
  pagenum:any=0;
  chartOfAccount:ChartOfAccount;
  chartOfAccountlpl:Account[]=[];
  Subtypesdd:Dropdown[]=[];
  AccountNumdd:Dropdown[]=[];
Typedd: Dropdown[]=[];
Updatestatus: any;

  advisorImpexptentitydetails:AdvisorImportExportEntityDetails;
  coaMasterDataResponse:CoaMasterDataResponse;
  constructor(private quickbookService:QuickbookService, public coaMappingreqmodelobj:COAmappingRequestModel) { }


  async ngOnInit() {
    //debugger
  this.getAllQBOMappingsAndExportedEntitiesCount();
  this.coaMasterDataResponse= await this.MasterCOAdata();
  this.Typedd= this.coaMasterDataResponse.coaMaterData.map(data =>{const d= new Dropdown();
  d.id=data.type;
d.value=data.type;
return d; });

this.Typedd = this.Typedd.filter((test, index, array) =>
index === array.findIndex((findTest) =>
   findTest.id === test.id
)
);

this.Subtypesdd= this.coaMasterDataResponse.coaMaterData.map(data =>{const d= new Dropdown();
  d.id=data.detailType;
d.value=data.detailType;
d.parentvalue=data.type;
return d; });

this.Subtypesdd = this.Subtypesdd.filter((test, index, array) =>
index === array.findIndex((findTest) =>
   findTest.id === test.id && findTest.parentvalue===test.parentvalue
)
);
/* console.log(this.Subtypesdd.length);
console.log(this.Subtypesdd); */
this.AccountNumdd= this.coaMasterDataResponse.coaMaterData.map(data =>{const d= new Dropdown();
  d.id=data.accountNo;
d.value=data.accountNo;
d.parentvalue=data.detailType;
return d; });

this.AccountNumdd = this.AccountNumdd.filter((test, index, array) =>
index === array.findIndex((findTest) =>
   findTest.id === test.id && findTest.parentvalue===test.parentvalue
)
);

const nulldropdown: Dropdown={

  id:null,
  value:null,
  parentvalue:null
}
this.AccountNumdd.push(nulldropdown);

/* console.log(this.AccountNumdd); */
this.getFilteredSubtypes = this.getFilteredSubtypes.bind(this);
this.getFilteredAccountNum = this.getFilteredAccountNum.bind(this);
/* console.log(this.getFilteredAccountNum); */


  }

  setDetailTypeValue(rowData: any, value: any): void {
    rowData.lplcoaAccountNo = null;
   (<any>this).defaultSetCellValue(rowData, value);
}

setStateValue(rowData: any, value: any): void {
  rowData.lplcoaDetailType = null;
 
  (<any>this).defaultSetCellValue(rowData, value);
}


setAccountNumValue(rowData: any, value: any): void {
    //rowData.accountName = null;
   
    (<any>this).defaultSetCellValue(rowData, value);
}
  getFilteredAccountNum(options) {
    /* console.log(options);
    console.log('getFilteredAccountNum'); */
    return {
        store: this.AccountNumdd,
        filter: options.data ? ["parentvalue", "=", options.data.lplcoaDetailType] : null
    };
}
getFilteredSubtypes(options) {
  /* console.log(options);
  console.log('getFilteredSubtypes'); */
  return {
      store: this.Subtypesdd,
      filter: options.data ? ["parentvalue", "=", options.data.lplcoaType] : null
  };
}
MasterCOAdata(): Promise<CoaMasterDataResponse>{
return this.quickbookService.MasterCOAdata().toPromise();
}
  getAllQBOMappingsAndExportedEntitiesCount(){
  this.quickbookService.getAllQBOMappingsAndExportedEntitiesCount().subscribe(data=>{
    this.advisorimportresponse =  data;
    
  });
    
   }
   onCOAMappingStatusChange(MStatus){
    this.quickbookService.GetAdvisorCOAmappingDetail(this.advisorImpexptentitydetails.advisorRelmID,MStatus).subscribe(data => {
      this.coaMappingreqmodelobj = data;
      console.log(this.coaMappingreqmodelobj.coaMapping);
      
    });
//console.log(MStatus);
   }

   onAdvisorImporExportEntityDetailsChange(deviceValue) {
  
    let emailid=deviceValue.split('_')[0];
    let lplqborealmid=deviceValue.split('_')[1];
    this.pagenum=0;
    //console.log(deviceValue);
    if(deviceValue){
    this.advisorImpexptentitydetails = this.advisorimportresponse.listAdvisorImporExportEntityDetails.filter(
      data => data.advisorEmail=== emailid && data.lplAdvisorRelmID===lplqborealmid)[0];
      //console.log(this.advisorImpexptentitydetails);
if(this.advisorImpexptentitydetails && this.advisorImpexptentitydetails.advisorRelmID){

      this.quickbookService.GetAdvisorCOAmappingDetail(this.advisorImpexptentitydetails.advisorRelmID).subscribe(data => {
        this.coaMappingreqmodelobj = data;
        console.log(this.coaMappingreqmodelobj.coaMapping);
        
      });
    

      
    }

    else{
      this.coaMappingreqmodelobj= new COAmappingRequestModel();
      /* this.advisorImpexptentitydetails=null;
      this.dsiableimportbutton=false; */
    }

    }
}

optionChangedHandler(args) {  
  if (args.name == "width" && args.value < 250) {  
      args.component.option("width", 300);  
  }  
}

onEditorPreparing(evt: any): void {  
 // debugger;
 var component = evt.component.instance(),  
            rowIndex = evt.row && evt.row.rowIndex;  
 if (evt.dataField === "lplcoaAccountNo")  { 
  evt.editorOptions.onValueChanged = (e: any) => {  
  // console.log(this.accountSubTypeValue);
    
    
    const accname= this.coaMasterDataResponse.coaMaterData.filter(data=>  data.accountNo==e.value).map((x)=> { 
      
      const dd=x.accountName;
return dd;
      ;})
      component.cellValue(rowIndex, 'lplcoaAccountNo', e.value); 
      component.cellValue(rowIndex, 'lplcoaName', accname[0]); 

     
  }  

 
}

evt.editorOptions.onOpened = function (arg) {  
  var popupInstance = arg.component._popup;  
  popupInstance.option('width', 300);  
  popupInstance.off("optionChanged", this.optionChangedHandler);  
  popupInstance.on("optionChanged", this.optionChangedHandler); 
  }

 


}

onRowRemoving(e:any){
  
 
 
  /* console.log(e);
  e.data = {}; */
  var rowIndex = (e.component.pageIndex()*e.component.pageSize()) +e.component.getRowIndexByKey(e.key);  

  
 /*  console.log(rowIndex); */
 let CoaMapping= this.coaMappingreqmodelobj.coaMapping[rowIndex];
 /* console.log( this.coaMappingreqmodelobj.coaMapping.length); */
 /* CoaMapping.lplcoaType="";
 CoaMapping.lplcoaDetailType="";
 CoaMapping.lplcoaAccountNo="";
 CoaMapping.lplcoaName="";
 CoaMapping.mappingStatus="U"; */
 this.coaMappingreqmodelobj.coaMapping[rowIndex].lplcoaType="";
 this.coaMappingreqmodelobj.coaMapping[rowIndex].lplcoaDetailType="";
 this.coaMappingreqmodelobj.coaMapping[rowIndex].lplcoaAccountNo="";
 this.coaMappingreqmodelobj.coaMapping[rowIndex].lplcoaName="";
 this.coaMappingreqmodelobj.coaMapping[rowIndex].mappingStatus="U";

e.component.refresh();
  /* console.log( this.coaMappingreqmodelobj.coaMapping.length); */
 //e.cancel=true;
 /*  console.log(e);  */
  //return false;
  
}

onRowPrepared (info:any) {  
  if(info.rowType === 'data') {  
      if (info.data.Status === 'Complete')  
          info.rowElement.addClass('nineteenthcentury');  
  }  
}
onRowUpdated(e:any){
  /* /* this.AccountNumdd=[];
  this.Subtypesdd=[];
  this.Subtypesdd=[]; 
  console.log(e.data); */
}

lplCOAmappingClick(){
 /*  this.coaMappingreqmodelobj.coaMapping= [];
  console.log(this.chartOfAccountlpl);
  console.log(this.chartOfAccountlpl.length); */
 
  this.Updatestatus=null;
  this.coaMappingreqmodelobj.coaMapping.forEach((item,index)=>{
 
    item.lplRealmId=this.advisorImpexptentitydetails.lplAdvisorRelmID;
    item.advisorRealmId=this.advisorImpexptentitydetails.advisorRelmID;
    item.advisorEmail=this.advisorImpexptentitydetails.advisorEmail;
    item.lplEmail=this.advisorImpexptentitydetails.advisorLPLQBOEmail;
    item.mappingStatus=item.lplcoaAccountNo && item.lplcoaName &&
    item.lplcoaDetailType && item.lplcoaType?"M":"U";
    item.createdDate=new Date;
    item.createdBy=sessionStorage.getItem("currentUser");

   //this.coaMappingreqmodelobj.coaMapping.push(data);
  // 
 
 });
 console.log(this.coaMappingreqmodelobj.coaMapping);
 this.quickbookService.lplCOAmapping(this.coaMappingreqmodelobj).subscribe(x=>{

  this.Updatestatus= x;
  console.log(this.Updatestatus);
 
});

}

}
