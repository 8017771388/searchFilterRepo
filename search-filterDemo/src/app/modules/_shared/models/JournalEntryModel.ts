export class JournalEntryMasterChildDetails
    {
      
      JournalEntries:JournalEntryView[]=[]
       
       JournalEntryLines:JournalEntryLineView[]=[]
    }


  class JournalEntryView
    {
         id :number;
         status :string;
         totalAmt :number;
         intuitId:number; 
         docNumber :string;
         transactionDate :Date;
        

    }


    class JournalEntryLineView
    {
         id :string;
         status :string;
         journalEntryId :number;
         intuitId :number; 
         description :string;
         amount :number;
         detailType :string;
         postingType :string;
         accountName :string;
         accountId:string; 
         entityType :string; 
         entityId:string;  
         entityName :string; 


    }