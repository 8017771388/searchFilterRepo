import { Component, OnInit } from '@angular/core';
import {SavedAdvisorMappingResponse} from '../../../_shared/models/SavedAdvisorMappingResponse'
import {COAMasterDataRequest} from '../../../_shared/models/COAMasterDataRequest'
import{QuickbookService} from '../../services/quickbook.service'

@Component({
  selector: 'app-coamasterdata',
  templateUrl: './coamasterdata.component.html',
  styleUrls: ['./coamasterdata.component.scss']
})
export class CoamasterdataComponent implements OnInit {


  fileToUpload: File;
  isvalidfile: boolean=false;
  fileName:string="Choose File";
  Fileerror: string="";
  display:string="none";
  savedAdvisorMappingResponse:SavedAdvisorMappingResponse;
  private selectedvalue: any="";
  constructor(private quickbookService:QuickbookService,private coaMasterDataRequest:COAMasterDataRequest) { 
   
  }

  ngOnInit() {
  }

  /* openAddCOAMasterDataModal(){
        //console.log("came accross");
        //this.getAllToDoData();
        let initialState = {
          title: "Show All ToDos",
    savedAdvisorMappingResponse:  this.UploadCOAMasterData(),
          
        };
    
        this.bsModalRef = this.modalService.show(CoamasterdataComponent, {initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false,  class: 'modal-lg'});
        this.bsModalRef.content.closeBtnName = 'Close'; 
    
      }  */

    UploadCOAMasterData(){
      this.quickbookService.UploadCOAMasterData(this.coaMasterDataRequest,sessionStorage.getItem('currentUser')).subscribe(data=>{
        this.savedAdvisorMappingResponse=data;
        this.fileName="Choose a File";
      })
    }

isValidCSVFile(file: any) {  
  return file.name.endsWith(".csv");  
}  

    onFilesAdded(files: FileList) {
      this.fileToUpload = files.item(0);
      this.fileName=this.fileToUpload.name;
      if (this.isValidCSVFile( this.fileToUpload)) {
        let fileReader = new FileReader();
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
                this.coaMasterDataRequest.base64EncodedData=csvRecordsArray;
                this.isvalidfile=true;
              this.Fileerror="";
               /*  let headersRow = this.getHeaderArray(csvRecordsArray);  
          
                let records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
                var jsonstring = '{\"advisorMappings\":'+ JSON.stringify( records)+'}';
                console.log(jsonstring);
                this.base64filestring=jsonstring;
                console.log(this.base64filestring); */
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
  onCloseHandled(){
    this.display='none';
  }
  openModal(){
 
    this.display='block';
    this.UploadCOAMasterData()

 }


}
