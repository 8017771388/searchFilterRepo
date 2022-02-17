export class MappedInstancesResponse
    {
       
        listMappedData :AdvisorMappingResponse[];
       ErrorMessage : string;
    }

    export class AdvisorMappingResponse
    {
         advisorName : string;
        advisorEmail : string;
        advisorRelmId : string;
        lPLAdvisorName : string;
        lPLAdvisorEmail : string;
        lplAdvisorRelmId : string;
    }