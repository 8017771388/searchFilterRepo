import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpService } from '../../_shared/services/http.services';
import { AppSettings } from '../../_shared/constants/api-constant';
import { AdvisorImporExportEntityResponse } from '../../_shared/models/AdvisorImporExportEntityResponse';
import { ProcessData } from '../../_shared/models/ProcessData';
import { AccessTokenRequest } from '../../_shared/models/AccessTokenRequest';
import { AdvisorAccessDetailsResponseModel } from '../../_shared/models/AdvisorAccessDetailsResponseModel';
import { LplQboInstanceDetails } from '../../_shared/models/LplQboInstanceDetails';
import {AdvisorQBOMappingResponse} from '../../_shared/models/AdvisorQBOMappingResponse';
import {SavedAdvisorMappingResponse} from '../../_shared/models/SavedAdvisorMappingResponse';
import {MappedInstancesResponse} from '../../_shared/models/MappedInstancesResponse';
import {ChartOfAccount} from '../../_shared/models/ChartOfAccount';
import {CoaMasterDataResponse} from '../../_shared/models/CoaMasterDataResponse';
import {COAmappingRequestModel} from '../../_shared/models/COAmappingRequestModel';
import {COAMasterDataRequest} from '../../_shared/models/COAMasterDataRequest';
import {RefreshTokenRequestModel} from '../../_shared/models/RefreshTokenRequestModel';
import {JournalEntryMasterChildDetails} from '../../_shared/models/JournalEntryModel';
import {AccessToken} from '../../_shared/models/AccessToken';
import {QboInstanceRequestModel} from '../../_shared/models/QboInstanceRequestModel';
import {EmployeeRequestModel} from '../../_shared/models/EmployeeRequestModel';
import { EmployeeResponse} from '../../_shared/models/EmployeeResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuickbookService {

  constructor(private httpService : HttpService,private http : HttpClient) { }

  getAllQBOMappingsAndExportedEntitiesCount (): Observable<AdvisorImporExportEntityResponse> {
    return this.httpService.get<AdvisorImporExportEntityResponse>(AppSettings.QBOUrl).pipe(map(response => response));
  }
  
  RedirectToLogInForImport(clientID: string,clientsecret: string, redirectUrlLPl:string){
    return this.httpService.get<any>(AppSettings.LogInForImportUrl+clientID+'&clientsecret='+clientsecret+'&Url='+redirectUrlLPl).pipe(
     map((url:any )=> {
       return url;}),
     
    );
  
  }
  
  GetProcessDetails(clientID: string,clientsecret: string) : Observable<ProcessData>{
  
    return this.httpService.get<ProcessData>(AppSettings.ProcessDetailsUrl+clientID+'&clientsecret='+clientsecret).pipe(
      map(response => response)
    );
  }

  GenerateAndUpdateTokenDetails(accessTokenRequest:AccessTokenRequest): Observable<AdvisorAccessDetailsResponseModel>{
    return this.httpService.post<AdvisorAccessDetailsResponseModel>(AppSettings.updatetokendetailsUrl, accessTokenRequest).pipe(
      map(response => response)
    );
  }
  
  InsertLplQboInstanceDetails(lplQboInstanceDetails:LplQboInstanceDetails): Observable<number>{
    return this.httpService.post<number>(AppSettings.insertlplqbodetailsUrl, lplQboInstanceDetails).pipe(map(response => response));
  }


  public UploadAdvisorMappingDetails(
    file: string
  ):Observable<AdvisorQBOMappingResponse> {

     const formData: FormData = new FormData();
    formData.append('base64EncodedData', file);
    /* let headers = new HttpHeaders({
      'Content-Type': 'application/json'
   });
   let options = {
      headers: headers
   } */

    return this.http.post<any>(AppSettings.uploadAdvisorMappingDetailsUrl,file)
    .pipe(  map(response => response)
    );
  }
  public InsertAndUpdateAdvisorMappingDetails(
    data: AdvisorQBOMappingResponse
  ):Observable<SavedAdvisorMappingResponse> {

return this.httpService.post<any>(AppSettings.insertAndUpdateAdvisorMappingDetailsUrl,data)
    .pipe(  map(response => response)
    );

  }
  public GetMappingInstanceDetails():Observable<MappedInstancesResponse> 
  {
    /* let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'd1d661820fb3c7991c96888766ddd7eedfecfcecd779277881d671ca73e4de46');
    headers = headers.append('x-Flatten', 'true');
    headers = headers.append( 'X-XSRF-TOKEN', 'd1d661820fb3c7991c96888766ddd7eedfecfcecd779277881d671ca73e4de46');
    headers = headers.append( 'timestamp', new Date().toLocaleString()); */
return this.httpService.get<any>(AppSettings.getMappingInstanceDetailsUrl)
    .pipe(  map(response => response)
    );

  }

  public AdvisorCOADetails(realmId:string):Observable<ChartOfAccount> 
  {

return this.httpService.get<any>(AppSettings.advisorCOADetailsUrl+realmId)
    .pipe( map(response => response)
    );

  }

  public GetAdvisorCOAmappingDetail(realmId:string,mappingStatus:any=null):Observable<COAmappingRequestModel> 
  {
if(mappingStatus){
return this.httpService.get<any>(AppSettings.getAdvisorCOAmappingDetailUrl+realmId+"&mappingStatus="+mappingStatus)
    .pipe( map(response => response)
    );
}
else{
  return this.httpService.get<any>(AppSettings.getAdvisorCOAmappingDetailUrl+realmId)
    .pipe( map(response => response)
    );
}

  }

  public MasterCOAdata():Observable<CoaMasterDataResponse> 
  {

return this.httpService.get<any>(AppSettings.masterCOAdataUrl)
    .pipe( map(response => response)
    );

  }
  public lplCOAmapping(
    data: COAmappingRequestModel
  ):Observable<string> {
    return this.httpService.post<any>(AppSettings.lplCOAmappingUrl,data)
    .pipe( map(response => response)
    );

  }

  public UploadCOAMasterData(
    data: COAMasterDataRequest, uploadedby:string
  ):Observable<SavedAdvisorMappingResponse> {

return this.httpService.post<any>(AppSettings.uploadCOAMasterDataUrl+uploadedby,data.base64EncodedData)
    .pipe(map(response => response)
    );

  }

  GenerateRefreshToken (refreshtokenreqmodel: RefreshTokenRequestModel): Observable<AccessToken> {
    return this.httpService.post<AccessToken>(AppSettings.generateRefreshTokensUrl, refreshtokenreqmodel).pipe(
      map(response => response)
    );
    }
    UpdateLPLQBOInstanceDetails(refreshtokenreqmodel: QboInstanceRequestModel): Observable<number> {
      return this.httpService.post<number>(AppSettings.updateLPLQBOInstanceDetailsUrl, refreshtokenreqmodel).pipe(
        map(response => response)
      );
      }


      lplCOAmappingUpdateLplIntuitId(employeeRequestModel: EmployeeRequestModel,advisorRelmID: string): Observable<string> {
        return this.httpService.post<string>(AppSettings.lplCOAmappingUpdateLplIntuitIdUrl+advisorRelmID+"", employeeRequestModel).pipe(
          map(response => response)
        );
        }

        transformJE(advisorRelmID: string,AdvisorEmail:string): Observable<string> {
          return this.httpService.post<string>(AppSettings.transformJEUrl+advisorRelmID+"&AdvisorEmail="+AdvisorEmail,{}).pipe(
            map(response => response)
          );
          }

      ImportEmployee(employeeRequestModel: EmployeeRequestModel,advisorRelmID: string): Observable<EmployeeResponse> {
        return this.httpService.post<EmployeeResponse>(AppSettings.importEmployeeUrl+advisorRelmID+"", employeeRequestModel,).pipe(
        
         
          map((x:EmployeeResponse )=> {
            const ret =x;
            ret.entityName ="Employee";
            ret.successMessage=ret.success==true?"Success": "Not a Success";
            return ret;
        }),
          
        );
        }

        ImportVendor(employeeRequestModel: EmployeeRequestModel,advisorRelmID: string): Observable<EmployeeResponse> {
          return this.httpService.post<EmployeeResponse>(AppSettings.importVendorUrl+advisorRelmID, employeeRequestModel).pipe(
           
            map((x:EmployeeResponse )=> {
              const ret =x;
              ret.entityName ="Vendor";
              ret.successMessage=ret.success==true?"Success": "Not a Success";
              return ret;
          }),
          
          );
          }

          Importcustomer(employeeRequestModel: EmployeeRequestModel,advisorRelmID: string): Observable<EmployeeResponse> {
            return this.httpService.post<EmployeeResponse>(AppSettings.importcustomerUrl+advisorRelmID, employeeRequestModel).pipe(
            
              map((x:EmployeeResponse )=> {
                const ret =x;
                ret.entityName ="Customer";
                ret.successMessage=ret.success==true?"Success": "Not a Success";
                return ret;
            }),
             
            );
            }

            Importchartofaccount(employeeRequestModel: EmployeeRequestModel,advisorRelmID: string): Observable<EmployeeResponse> {
              return this.httpService.post<EmployeeResponse>(AppSettings.importchartofaccountUrl+advisorRelmID, employeeRequestModel).pipe(
              
                map((x:EmployeeResponse )=> {
                  const ret =x;
                  ret.entityName ="Chart Of Account";
                  ret.successMessage=ret.success==true?"Success": "Not a Success";
                  return ret;
              }),
              
              );
              }

              Importjournalentry(employeeRequestModel: EmployeeRequestModel,advisorRelmID: string): Observable<EmployeeResponse> {
                return this.httpService.post<EmployeeResponse>(AppSettings.importjournalentryUrl+advisorRelmID, employeeRequestModel).pipe(
                
                  map((x:EmployeeResponse )=> {
                    const ret =x;
                    ret.entityName ="Journal Entry";
                    ret.successMessage=ret.success==true?"Success": "Not a Success";
                    return ret;
                }),
                 
                );
                }

                Viewjournalentry(advisorRelmID: string,status:string): Observable<JournalEntryMasterChildDetails> {
                  return this.httpService.post<JournalEntryMasterChildDetails>(AppSettings.viewjournalentry+advisorRelmID+"&status="+status,{}).pipe(
                    map(response => response)
                  );
                  }
}
