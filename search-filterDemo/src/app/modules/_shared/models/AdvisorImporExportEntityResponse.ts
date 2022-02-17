import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class AdvisorImporExportEntityResponse
{
    listAdvisorImporExportEntityDetails :AdvisorImportExportEntityDetails[];
    error?:string;
    isSuccess?:Boolean;



}
@Injectable({
    providedIn: 'root'
  })
export class AdvisorImportExportEntityDetails
{
      advisorEmail?:string;
      advisorLPLQBOEmail?:string;
   employeeCount?:Number;
    vendorCount?:Number;
     customerCount? :Number;
     chartOfAccountsCount? : Number;
     journalEntryCount?:number;
     advisorRelmID?: string;
     lplAdvisorRelmID?: string;
     accessToken? : string;
    accessTokenExpiryDate? : Date;
    clientID? : string;
   clientSecret? :string;
    refreshToken?: string;
    refreshTokenExpiryDate?:Date;
}
