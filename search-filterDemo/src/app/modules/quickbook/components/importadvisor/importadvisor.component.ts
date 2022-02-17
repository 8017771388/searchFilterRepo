import { Component, OnInit } from '@angular/core';
import{QuickbookService} from '../../services/quickbook.service'
import{AdvisorImporExportEntityResponse,AdvisorImportExportEntityDetails} from '../../../_shared/models/AdvisorImporExportEntityResponse'
import { ActivatedRoute,Router } from '@angular/router';
import { getLocaleDateFormat } from '@angular/common';
import { promise } from 'protractor';
import {ProcessData} from '../../../_shared/models/ProcessData'
import {AccessTokenRequest} from '../../../_shared/models/AccessTokenRequest'
import {AdvisorAccessDetailsResponseModel} from '../../../_shared/models/AdvisorAccessDetailsResponseModel'
import {LplQboInstanceDetails} from '../../../_shared/models/LplQboInstanceDetails'
import { AppSettings } from '../../../_shared/constants/api-constant';

@Component({
  selector: 'app-importadvisor',
  templateUrl: './importadvisor.component.html',
  styleUrls: ['./importadvisor.component.scss']
})
export class ImportadvisorComponent implements OnInit {
  advisorimportresponse:AdvisorImporExportEntityResponse;
  dsiableimportbutton:Boolean=false;
  advisorImpexptentitydetails:AdvisorImportExportEntityDetails;
 /*  private redirectUrlLPL:string= "http://localhost:4200/importadvisor"; */
private RedirectUrl:string;
selectedvalue: any="";
/*  QBOEMAIL:string = "yawar.hayat@lpl.com";
 advisorRealmId:string = "4620816365013523780"; */
processdata: ProcessData;
advisorAccessDetailsResponseModel:AdvisorAccessDetailsResponseModel;
importbuttonname: string= "Connect";
  constructor(private quickbookService:QuickbookService,private actrouter: ActivatedRoute, private router:Router) {
   }

 async ngOnInit() {
    debugger;
    this.advisorimportresponse = await this.getAllQBOMappingsAndExportedEntitiesCount();
   

if(localStorage.getItem('deviceValue')){
  this.selectedvalue=localStorage.getItem('deviceValue');
  this.onAdvisorImporExportEntityDetailsChange(this.selectedvalue);
  this.processdata= await this.GetProcessDetails();
  const accessTokenRequest:AccessTokenRequest={
    ClientId:this.advisorImpexptentitydetails.clientID,
    ClientSecret:this.advisorImpexptentitydetails.clientSecret,
    Code:this.actrouter.snapshot.queryParamMap.get('code'),
    RedirectUri:AppSettings.redirectUrlLPL,
    TokenEndPoint:this.processdata.tokenEndpoint,
    IsImport:true
  }

  const retval:AdvisorAccessDetailsResponseModel= await this.GenerateAndUpdateTokenDetails(accessTokenRequest);

const lplQboInstanceDetails:LplQboInstanceDetails={
  realmId: this.advisorImpexptentitydetails.lplAdvisorRelmID,
  lplQboEmail:this.advisorImpexptentitydetails.advisorLPLQBOEmail,
  clientID:this.advisorImpexptentitydetails.clientID,
  ClientSecret:this.advisorImpexptentitydetails.clientSecret,
  AccessToken:retval.tokenResponse.accessToken,
 /*  accessTokenExpiryDate: new Date().setSeconds(new Date().getSeconds()+retval.tokenResponse.accessTokenExpiresIn).toString(), */
  accessTokenExpiryDate: retval.tokenResponse.accessTokenExpiresIn.toString(),
  refreshtoken: retval.tokenResponse.refreshToken,
/*   RefreshtokenExpiryDate: new Date().setSeconds(new Date().getSeconds()+retval.tokenResponse.refreshTokenExpiresIn).toString(), */
RefreshtokenExpiryDate: retval.tokenResponse.refreshTokenExpiresIn.toString(),
}
const insertdatat : any =await this.InsertLplQboInstanceDetails(lplQboInstanceDetails);
// after Updateing newly generated access and refresh token to database
this.advisorimportresponse = await this.getAllQBOMappingsAndExportedEntitiesCount();
this.onAdvisorImporExportEntityDetailsChange(this.selectedvalue);

this.importbuttonname="Import";
  localStorage.removeItem('deviceValue');
}


  }
  
  GetProcessDetails():Promise<ProcessData>{
    return this.quickbookService.GetProcessDetails(this.advisorImpexptentitydetails.clientID,this.advisorImpexptentitydetails.clientSecret).toPromise();
    
   }

   GenerateAndUpdateTokenDetails(data:AccessTokenRequest ):Promise<AdvisorAccessDetailsResponseModel>{
    return this.quickbookService.GenerateAndUpdateTokenDetails(data).toPromise();
   }
   InsertLplQboInstanceDetails(data:LplQboInstanceDetails ):Promise<number>{
    return this.quickbookService.InsertLplQboInstanceDetails(data).toPromise();
   }
  
  getAllQBOMappingsAndExportedEntitiesCount():Promise<AdvisorImporExportEntityResponse>{
   return this.quickbookService.getAllQBOMappingsAndExportedEntitiesCount().toPromise();
   
  }

  onAdvisorImporExportEntityDetailsChange(deviceValue) {
    //debugger;
    //console.log(deviceValue);
    if(deviceValue){
      let emailid=deviceValue.split('_')[0];
    let lplqborealmid=deviceValue.split('_')[1];
    this.advisorImpexptentitydetails = this.advisorimportresponse.listAdvisorImporExportEntityDetails.filter(
      data => data.advisorEmail=== emailid && data.lplAdvisorRelmID===lplqborealmid)[0];
      if(this.advisorImpexptentitydetails){
        this.dsiableimportbutton= this.advisorImpexptentitydetails.advisorLPLQBOEmail &&(this.advisorImpexptentitydetails.customerCount>0 
         || this.advisorImpexptentitydetails.vendorCount>0|| this.advisorImpexptentitydetails.employeeCount>0)?true:false;

         if(this.dsiableimportbutton){
          
         localStorage.setItem('deviceValue', deviceValue);
         }
      }

    }
    else{
      this.advisorImpexptentitydetails=null;
      this.dsiableimportbutton=false;
    }
     // console.log(JSON.stringify(this.advisorImpexptentitydetails));
}

importAdvisorClick(){
  debugger;
  if(new Date(this.advisorImpexptentitydetails.refreshTokenExpiryDate)>new Date()){
  this.router.navigate(['/quickbook/quickbook/eqblplconnect'], { queryParams: {emailid: this.advisorImpexptentitydetails.advisorEmail, lplqborealmid: this.advisorImpexptentitydetails.lplAdvisorRelmID}});
}

  else{
    this.quickbookService.RedirectToLogInForImport(this.advisorImpexptentitydetails.clientID,this.advisorImpexptentitydetails.clientSecret,AppSettings.redirectUrlLPL).subscribe(url => {
      this.RedirectUrl=url.Url;
      window.location.href = url.Url;
     // console.log(JSON.stringify(this.advisorimportresponse.listAdvisorImporExportEntityDetails));
    },
    error => {
        //debugger;
       console.log(error);
       
    });
    
   
  }

}

}
