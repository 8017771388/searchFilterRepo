export class AdvisorImportExportMappingModel
    {
      advisorName: string;
        advisorEmail :string;
        advsiorRealmID :string;
        advisorClientID :string;
        advisorClientSecret :string;
        lplAdvisorName: string;
        lplAdvisorEmail :string;
        lplAdvsiorRealmID :string;
        lplAdvisorClientID :string;
        lplAdvisorClientSecret :string;

        
    }
    export class AdvisorQBOMappingResponse
    {
      listAdvisorQBOMappingResponseModel:AdvisorQBOMappingResponseModel[];
        errorMessage:string
    }
    export class AdvisorQBOMappingResponseModel
    {
          advisorImportExportMappingModel :AdvisorImportExportMappingModel;
         isSuccess :boolean;
         error:string;
         isDuplicate:boolean;
    }