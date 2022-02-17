import { Component, OnInit } from '@angular/core';
import{QuickbookService} from '../../services/quickbook.service'
import {JournalEntryMasterChildDetails} from '../../../_shared/models/JournalEntryModel';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import{AdvisorImporExportEntityResponse,AdvisorImportExportEntityDetails} from '../../../_shared/models/AdvisorImporExportEntityResponse'
@Component({
  selector: 'app-jeview',
  templateUrl: './jeview.component.html',
  styleUrls: ['./jeview.component.scss']
})
export class JeviewComponent implements OnInit {
  tasksDataSourceStorage: any=[];
  advisorimportresponse:AdvisorImporExportEntityResponse;
  selectedvalue: any="";
  selectedMSvalue: any="unProcessed";
  advisorImpexptentitydetails:AdvisorImportExportEntityDetails;
  constructor(private quickbookService:QuickbookService) { }
  journalEntryMasterChildDetails:JournalEntryMasterChildDetails;
  ngOnInit() {
    this.getAllQBOMappingsAndExportedEntitiesCount();
    
  }

  getLineDetails(key) {
    let item = this.tasksDataSourceStorage.find((i) => i.key === key);
    if (!item) {
        item = {
            key: key,
            dataSourceInstance: new DataSource({
                store: new ArrayStore({
                    data: this.journalEntryMasterChildDetails.JournalEntryLines,
                    key: "id"
                }),
                filter: ["journalEntryId", "=", key]
            })
        };
        this.tasksDataSourceStorage.push(item)
    }
    return item.dataSourceInstance;
}


getAllQBOMappingsAndExportedEntitiesCount(){
  this.quickbookService.getAllQBOMappingsAndExportedEntitiesCount().subscribe(data=>{
    this.advisorimportresponse =  data;
    
  });
    
   }

   onAdvisorImporExportEntityDetailsChange(deviceValue) {
  
    let emailid=deviceValue.split('_')[0];
    let lplqborealmid=deviceValue.split('_')[1];
 
    //console.log(deviceValue);
    if(deviceValue){
    this.advisorImpexptentitydetails = this.advisorimportresponse.listAdvisorImporExportEntityDetails.filter(
      data => data.advisorEmail=== emailid && data.lplAdvisorRelmID===lplqborealmid)[0];
      //console.log(this.advisorImpexptentitydetails);
if(this.advisorImpexptentitydetails && this.advisorImpexptentitydetails.advisorRelmID){
  this.quickbookService.Viewjournalentry(this.advisorImpexptentitydetails.advisorRelmID,"unProcessed").subscribe(data => {
    this.journalEntryMasterChildDetails=data;
   
  })
}
    }

    else{
      this.journalEntryMasterChildDetails= new JournalEntryMasterChildDetails();
      /* this.advisorImpexptentitydetails=null;
      this.dsiableimportbutton=false; */
    }
    }

}
