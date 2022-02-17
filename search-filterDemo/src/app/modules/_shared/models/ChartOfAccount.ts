 export  class Account
    {
      name:string;
        subAccount: boolean;
        parentRef :ParentRef;
        fullyQualifiedName:string;
        active:boolean;
         classification :string;
        accountType:string;
        accountSubType:string;
         currentBalance : number;
       currentBalanceWithSubAccounts : number;
          currencyRef :CurrencyRef;
         domain :string;
         sparse :boolean;
         id :string;
        syncToken: string;
         metaData :MetaData;
         acctNum :string;
    }

    export class QueryResponse
    {
        account :Account[];
        startPosition :number;
        maxResults:number;
    }
   export class ParentRef
    {
        value: number;
               
    }
    export class ChartOfAccount
    {
         queryResponse :QueryResponse;
         time :Date;
    }

    export class CurrencyRef
    {
         value : string;
         name :string;
    }

    export class MetaData
    {
     CreateTime:Date;
      LastUpdatedTime :Date;
    }