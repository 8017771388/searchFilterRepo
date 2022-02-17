import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RefreshTokenRequestModel} from '../../../_shared/models/RefreshTokenRequestModel';
import {AccessToken} from '../../../_shared/models/AccessToken';
import { QboInstanceRequestModel} from '../../../_shared/models/QboInstanceRequestModel';
import {EmployeeRequestModel} from '../../../_shared/models/EmployeeRequestModel';
import { EmployeeResponse} from '../../../_shared/models/EmployeeResponse';
import{AdvisorImporExportEntityResponse,AdvisorImportExportEntityDetails} from '../../../_shared/models/AdvisorImporExportEntityResponse';
import{QuickbookService} from '../../services/quickbook.service'
import { AppSettings } from '../../../_shared/constants/api-constant';

@Component({
  selector: 'app-eqblplconnect',
  templateUrl: './eqblplconnect.component.html',
  styleUrls: ['./eqblplconnect.component.scss']
})
export class EqblplconnectComponent implements OnInit {

  emailid: string;
lplqborealmid: string;
/* redirectUrlLPL ="http://localhost:50812/Data/lplImport";  */
advisorimportresponse:AdvisorImporExportEntityResponse;
  dsiableimportbutton:Boolean=false;
  advisorImpexptentitydetails:AdvisorImportExportEntityDetails;
  accesstoken:AccessToken;
  updatestatus: number;
  employeeresponsemodel: EmployeeResponse[]=[];

  constructor(private quickbookService:QuickbookService,private router: ActivatedRoute) { }

  ngOnInit() {
    debugger;
    this.emailid = this.router.snapshot.queryParamMap.get('emailid');
    this.lplqborealmid = this.router.snapshot.queryParamMap.get('lplqborealmid');
    this.GetQBOMappingByEmail(this.emailid);

    

  }
   GetAllQBOMapping(): Promise<AdvisorImporExportEntityResponse>{

     return this.quickbookService.getAllQBOMappingsAndExportedEntitiesCount().toPromise();
   
      
  }
 async GetQBOMappingByEmail(email : string ){
   debugger;
    this.advisorimportresponse= await this.GetAllQBOMapping();
    this.advisorImpexptentitydetails = this.advisorimportresponse.listAdvisorImporExportEntityDetails.filter(
      data => data.advisorEmail=== email && data.lplAdvisorRelmID===this.lplqborealmid)[0];

      if(this.advisorImpexptentitydetails){

        this.accesstoken=await this.GenerateRefreshToken();
        const  qboinstmodel: QboInstanceRequestModel={
                _accessToken: this.accesstoken,
               QBOEmail: this.advisorImpexptentitydetails.advisorLPLQBOEmail,
               QBORelmId:this.advisorImpexptentitydetails.lplAdvisorRelmID
         }
         this.quickbookService.UpdateLPLQBOInstanceDetails(qboinstmodel).subscribe(data => {
           this.updatestatus = data;
          // console.log(JSON.stringify(this.advisorimportresponse.listAdvisorImporExportEntityDetails));
         });



         const employeereqmod: EmployeeRequestModel={
          realmId: this.advisorImpexptentitydetails.lplAdvisorRelmID,
          token: this.accesstoken.access_token,
          email:this.advisorImpexptentitydetails.advisorEmail
         }

         

         /* this.quickbookService.lplCOAmappingUpdateLplIntuitId(employeereqmod,this.advisorImpexptentitydetails.advisorRelmID).subscribe(data => {
         console.log(data);
         // console.log(JSON.stringify(this.advisorimportresponse.listAdvisorImporExportEntityDetails));
        });

        this.quickbookService.transformJE(this.advisorImpexptentitydetails.advisorRelmID,this.advisorImpexptentitydetails.advisorEmail).subscribe(data => {
          console.log(data);
          // console.log(JSON.stringify(this.advisorimportresponse.listAdvisorImporExportEntityDetails));
         }); */

      let COAmappingUpdateLplIntuitIdres = await this.lplCOAmappingUpdateLplIntuitId(employeereqmod);

      let transformJEres= await this.transformJE();

      
      this.quickbookService.Importjournalentry(employeereqmod,this.advisorImpexptentitydetails.advisorRelmID).subscribe(data => {
        this.employeeresponsemodel.push(data);
       // console.log(JSON.stringify(this.advisorimportresponse.listAdvisorImporExportEntityDetails));
      });

         this.quickbookService.ImportEmployee(employeereqmod,this.advisorImpexptentitydetails.advisorRelmID).subscribe(data => {
          this.employeeresponsemodel.push(data);
         // console.log(JSON.stringify(this.advisorimportresponse.listAdvisorImporExportEntityDetails));
        });

        this.quickbookService.Importcustomer(employeereqmod,this.advisorImpexptentitydetails.advisorRelmID).subscribe(data => {
          this.employeeresponsemodel.push(data);
         // console.log(JSON.stringify(this.advisorimportresponse.listAdvisorImporExportEntityDetails));
        });


         this.quickbookService.ImportVendor(employeereqmod,this.advisorImpexptentitydetails.advisorRelmID).subscribe(data => {
          this.employeeresponsemodel.push(data);
         // console.log(JSON.stringify(this.advisorimportresponse.listAdvisorImporExportEntityDetails));
        }); 

        /* this.quickbookService.Importchartofaccount(employeereqmod,this.advisorImpexptentitydetails.advisorRelmID).subscribe(data => {
          this.employeeresponsemodel.push(data);
         // console.log(JSON.stringify(this.advisorimportresponse.listAdvisorImporExportEntityDetails));
        }); */

       
       }

  }

  transformJE():Promise<any>{
   return this.quickbookService.transformJE(this.advisorImpexptentitydetails.advisorRelmID,this.advisorImpexptentitydetails.advisorEmail).toPromise();
  }

  lplCOAmappingUpdateLplIntuitId(employeereqmod: EmployeeRequestModel):Promise<any>{
   return  this.quickbookService.lplCOAmappingUpdateLplIntuitId(employeereqmod,this.advisorImpexptentitydetails.advisorRelmID).toPromise();
  }

 GenerateRefreshToken():Promise<AccessToken>{

    const reftokenmod: RefreshTokenRequestModel = {
      QboClient_Id: this.advisorImpexptentitydetails.clientID,
      QboClient_Secret: this.advisorImpexptentitydetails.clientSecret,
      QboredirectUrl: AppSettings.redirectUrlLPL,
      QboRefreshToken:this.advisorImpexptentitydetails.refreshToken
    };
   
   return this.quickbookService.GenerateRefreshToken(reftokenmod).toPromise();
  }



}
