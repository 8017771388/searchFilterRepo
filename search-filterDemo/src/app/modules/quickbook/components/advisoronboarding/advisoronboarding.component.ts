import { Component, OnInit } from '@angular/core';
import{QuickbookService} from '../../services/quickbook.service'
import {AdvisorQBOMappingResponse,AdvisorImportExportMappingModel} from '../../../_shared/models/AdvisorQBOMappingResponse'
import { Observable, ReplaySubject, Subject } from 'rxjs';
import {SavedAdvisorMappingResponse} from '../../../_shared/models/SavedAdvisorMappingResponse'
import {MappedInstancesResponse} from '../../../_shared/models/MappedInstancesResponse'

import {AdvisorMapping} from '../../../_shared/models/AdvisorMapping'

@Component({
  selector: 'app-advisoronboarding',
  templateUrl: './advisoronboarding.component.html',
  styleUrls: ['./advisoronboarding.component.scss']
})
export class AdvisoronboardingComponent implements OnInit {

  arrayBuffer: any;
base64filestring: any;
  constructor(private quickbookService:QuickbookService) { }
  fileToUpload: File;
  isvalidfile: boolean=false;
  fileName:string="Choose File";
  Fileerror: string="";
  display:string="none";
  displaySaveResponse:string="none";
  advisorQBOMappingResponse: AdvisorQBOMappingResponse;
  savedAdvisorMappingResponse:SavedAdvisorMappingResponse;
  mappedInstancesResponse:MappedInstancesResponse;
  ngOnInit() {
    this.display="none";
  this.displaySaveResponse="none";
  const replaySubject = new ReplaySubject();

  replaySubject.next('hello from ReplaySubject!');
  replaySubject.subscribe(v => console.log(v));
  replaySubject.next('hello from second event from ReplaySubject!');
  
 
  
    this.GetMappingInstanceDetails();
  }
  onFilesAdded(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileName=this.fileToUpload.name;
    let fileReader = new FileReader();
    if (this.isValidCSVFile( this.fileToUpload)) {
      
      fileReader.readAsText(files.item(0));  
    
    fileReader.onload = (e) => {
              /* this.arrayBuffer = fileReader.result;
              var data = new Uint8Array(this.arrayBuffer);
              var arr = new Array();
              for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
              var bstr = arr.join("");
              var workbook = XLSX.read(bstr, {type:"binary"});
              var first_sheet_name = workbook.SheetNames[0];
              var worksheet = workbook.Sheets[first_sheet_name];
              let xlsxdata = XLSX.utils.sheet_to_json(worksheet,{raw:true}); */

             
              let csvData = fileReader.result;  
              let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
        
              let headersRow = this.getHeaderArray(csvRecordsArray);  
        
              let records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
              var jsonstring = '{\"advisorMappings\":'+ JSON.stringify( records)+'}';
              console.log(jsonstring);
              this.base64filestring=jsonstring;
              console.log(this.base64filestring);
              this.isvalidfile=true;
              this.Fileerror="";
          }; fileReader.onerror = function () {  
            console.log('error is occured while reading file!');  
          }; 
          fileReader.readAsArrayBuffer(this.fileToUpload); 
      
        } else {  
          this.isvalidfile=false;
          this.Fileerror="Please import valid .csv file.";  
          this.fileName="Choose a File";
        }  
         
    
}

getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
  let csvArr = [];  
try{
  for (let i = 1; i < csvRecordsArray.length; i++) {  
    let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
    if (curruntRecord.length == headerLength) {  
      let csvRecord: AdvisorMapping = new AdvisorMapping();  
      csvRecord.AdvisorName = curruntRecord[0].trim();  
      csvRecord.AdvisorEmail = curruntRecord[1].trim();  
      csvRecord.LPLAdvisorName = curruntRecord[2].trim();  
      csvRecord.LPLAdvisorEmail = curruntRecord[3].trim();  
      csvRecord.LPLAdvsiorRealmID = curruntRecord[4].trim();  
      csvRecord.LPLAdvisorClientID = curruntRecord[5].trim();  
      csvRecord.LPLAdvisorClientSecret = curruntRecord[6].trim(); 
      csvArr.push(csvRecord);  
    }  
  } 
}
catch(e){
  this.Fileerror="Please import valid .csv file.";
  this.fileName="Choose a File";
  throw e;
} 
  return csvArr;  
}  

isValidCSVFile(file: any) {  
  return file.name.endsWith(".csv");  
}  

getHeaderArray(csvRecordsArr: any) {  
  let headers = (<string>csvRecordsArr[0]).split(',');  
  let headerArray = [];  
  for (let j = 0; j < headers.length; j++) {  
    headerArray.push(headers[j]);  
  }  
  return headerArray;  
}  

UploadAdvisorMappingDetails(){
//debugger;
if(this.isvalidfile){
this.quickbookService.UploadAdvisorMappingDetails(this.base64filestring).subscribe(data => {
  // do something, if upload success
  this.advisorQBOMappingResponse=data;
  this.openModal();
  this.fileName="Choose a File";
  }, error => {
    console.log(error);
  });
}
else{

  this.fileName="Choose a File";
}
}

InsertAndUpdateAdvisorMappingDetails(){
  debugger;
  this.quickbookService.InsertAndUpdateAdvisorMappingDetails(this.advisorQBOMappingResponse).subscribe(data => {
    // do something, if upload success
    this.savedAdvisorMappingResponse=data;
    //this.GetMappingInstanceDetails();
      this.onCloseHandled();
    this.opensavedAdvisorMappingResponseModal();
    

    }, error => {
      console.log(error);
      this.onCloseHandled();
    });
  }
  public GetMappingInstanceDetails()

  {
this.quickbookService.GetMappingInstanceDetails().subscribe(data => {
    // do something, if upload success
    this.mappedInstancesResponse=data;
  
    
    }, error => {
      console.log(error);
    });
  }

  onCloseHandled(){
    this.display='none';
  }
  openModal(){
 
    this.display='block';

 }
 onsavedAdvisorMappingResponseCloseHandled(){
  this.displaySaveResponse='none';
  this.GetMappingInstanceDetails();
}
opensavedAdvisorMappingResponseModal(){

  this.displaySaveResponse='block';

}


}
