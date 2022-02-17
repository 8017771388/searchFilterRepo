declare var configEnvironment: any;

// EASE Link
// export const VCFOHO_LINK = configEnvironment.REST_URL + '/api';

// export const ADD_TOKEN_API = VCFOHO_LINK + '/CodeAndDecode';
// export const GET_TYPE_API = VCFOHO_LINK + '/GetDistinctEntityTypes';
// export const ENTITY_DESC_API = VCFOHO_LINK +'/GetEntityDescTypeDetails';
// export const ENTITT_MAINTAIN= VCFOHO_LINK+'/MaintainEntityDescTypeDetails';
// export const ERROR_DETAIL = VCFOHO_LINK +'/GetErrorDetails';

// Authentication/ Authorization
export const AUTH_URL = configEnvironment.AuthConstants.AuthUrl;
export const CW_IMAGE_URL = configEnvironment.AuthConstants.Cw_Img_Url;
export const USER_ROLE_URL = './assets/json/authentication/' + 'role-access.json';
export const CURRENT_ENV = configEnvironment.VCFOHO_Environment;
export const ADMIN_USER = configEnvironment.AuthConstants.ADMIN_USER;
export const NORMAL_USER = configEnvironment.AuthConstants.NORMAL_USER;
export const ANALYST_USER = configEnvironment.AuthConstants.ANALYST_USER;

export class AppSettings {

    public static APPLICATION_VERSION = "1.0.0";
    //public static SW_ENVIRONMENT = configEnvironment.sw_Environment;;
    //public static HO_CORE_BASE_URL = configEnvironment.HO_BASE_URL;
    public static Mule_Service_URL = configEnvironment.MULE_SERVICES;
    public static apiKey = {
        client_id: configEnvironment.CLIENT_ID,
        client_secret: configEnvironment.CLIENT_SECRET
    }; 
    
    public static adGroup = {
        vcfo: NORMAL_USER,
        vcfoManager: ADMIN_USER,
        cfoAnalyst: ANALYST_USER
    }

    //Core-Plan Services
    
    public static getActionPlan = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/advisors/plan";
    public static saveActionPlan = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/plan";
    public static updateActionPlanGoal = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/advisors/goals";
    public static actionPlanTask = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/advisors/tasks";
    public static completeTask = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/complete-task";
    public static getAllNote = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/notes-of-task";
    public static addNote = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/notes";
    public static categoryGoalsList = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/categories-goals";
    public static goals = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/goals";
    public static tasks = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/tasks";
    // public static homePage = AppSettings.Mule_Service_URL + "/vcfo/prc/requests/home-page";
    public static homePage = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/home-page";
    public static allVcfos = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/vcfos";
    public static goalDetails = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/goal-details";
    public static profiles = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/advisordetails/profiles";
    public static hoUsers = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/ho-users?noCache=1568887874906";
    public static advisordetails = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/advisordetails";
    public static advisordetailsEdit = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/advisordetails/";
    public static searchAdvisor =  AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/advisors";
    public static categories = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/categories";
    public static saveGoalOrder = AppSettings.Mule_Service_URL + '/vcfo/exp-ho/requests/goal-order'; 
    public static repList = AppSettings.Mule_Service_URL+ "/vcfo/exp-ho/requests/rep-info"; 
    public static adDetail = AppSettings.Mule_Service_URL+ "/vcfo/exp-ho/requests/ad-details";  
    public static homeOfficeUsers = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/ho-users";   
    public static enableCWAccess = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/asat-flag"; 
    public static calenderView = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/calendar-view"; 
    public static allAnalysts = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/analyst"; 
    public static internalStatus = AppSettings.Mule_Service_URL + "/vcfo/exp-ho/requests/internal-status";  
    
    //quickbook api Urls

    public static generateRefreshTokensUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/Admin/GenerateRefreshToken";
  public static updateLPLQBOInstanceDetailsUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/Admin/UpdateLPLQBOInstanceDetails";
  public static importEmployeeUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/employee/importEmployee?advisorRealmId=";
  public static importcustomerUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/customer/importcustomer?advisorRealmId=";
  public static importVendorUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/vendor/importVendor?advisorRealmId=";
  public static importchartofaccountUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/ChartOfAccount/importchartofaccount?advisorRealmId=";

  public static loginapiurl: string = configEnvironment.REST_URL + "/LPLQBORestAPI/api/Admin/vcfoLogin";
  public static QBOUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/Admin/GetAllQBOMappingsAndExportedEntitiesCount";
  public static LogInForImportUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/Admin/RedirectToLoginUrl?clientId="
  public static ProcessDetailsUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/Admin/GetProcessDetails?clientId="
  public static updatetokendetailsUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/AdvisorAccessDetails/GenerateTokenDetails";
  public static insertlplqbodetailsUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/lplqbo/insertlplqbodetails";

  public static uploadAdvisorMappingDetailsUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/Admin/UploadAdvisorMappingDetails";
  public static uploadAdvisorMappingDetailsUrlV1 = configEnvironment.REST_URL + "/LPLQBORestAPI/api/Admin/UploadAdvisorMappingDetailsV1";


  public static insertAndUpdateAdvisorMappingDetailsUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/Admin/InsertAndUpdateAdvisorMappingDetails";
  public static getMappingInstanceDetailsUrl = configEnvironment.REST_URL + "/LPLQBORestAPI/api/Admin/GetMappingInstanceDetails";
  
  public static advisorCOADetailsUrl=  configEnvironment.REST_URL + "/LPLQBORestAPI/api/ChartOfAccount/AdvisorCOADetails?realmId=";
  public static getAdvisorCOAmappingDetailUrl=  configEnvironment.REST_URL + "/LPLQBORestAPI/api/ChartOfAccount/GetAdvisorCOAmappingDetail?realmId=";
  public static masterCOAdataUrl=  configEnvironment.REST_URL + "/LPLQBORestAPI/api/chartofaccount/MasterCOAdata"
   public static lplCOAmappingUrl=  configEnvironment.REST_URL +"/LPLQBORestAPI/api/ChartOfAccount/lplCOAmapping";
   public static lplCOAmappingUpdateLplIntuitIdUrl=  configEnvironment.REST_URL +"/LPLQBORestAPI/api/ChartOfAccount/lplCOAmappingUpdateLplIntuitId?advisorRealmId=";
   public static transformJEUrl=  configEnvironment.REST_URL +"/LPLQBORestAPI/api/JournalEntry/transformJE?advisorRealmId=";
  public static importjournalentryUrl=  configEnvironment.REST_URL +"/LPLQBORestAPI/api/JournalEntry/importjournalentry?advisorRealmId=";
  public static uploadCOAMasterDataUrl= configEnvironment.REST_URL +"/LPLQBORestAPI/api/Admin/UploadCOAMasterData?uploadedBy=";

  public static viewjournalentry= configEnvironment.REST_URL +"/LPLQBORestAPI/api/JournalEntry/viewjournalentry?advisorRealmId=";
  // public static redirectUrlLPLeqblplpl = "http://localhost:50812/Data/lplImport";
  //public static redirectUrlLPL: string = "http://localhost:4200/importadvisor";
  public static redirectUrlLPL: string = configEnvironment.LPLQBOAdminWeb_URI+"cfoadmin/quickbook/quickbook/importadvisor";
}