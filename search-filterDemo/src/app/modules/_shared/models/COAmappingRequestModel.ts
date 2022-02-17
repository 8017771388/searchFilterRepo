import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class COAmappingRequestModel
    {
      coaMapping :CoaMapping[]=[];
    }
    @Injectable({ providedIn: 'root' })
    export class CoaMapping
    {
        advisorEmail :string;
        advisorRealmId :string;
        advisorCOAIntuitId :string;
        advisorCOAAccountNo :string;
        advisorCOAName :string;
        advisorCOAType :string;
        advisorCOADetailType :string;
        lplEmail :string;
        lplRealmId :string;
        lPLCOAIntuitId :string;
        lplcoaAccountNo :string;
        lplcoaName :string;
        lplcoaType :string;
        lplcoaDetailType :string;
        mappingStatus :string;
        createdDate :Date;
        createdBy :string;
    }