export class ProcessData
    {
      discoveryClient:Discoveryclient;
          doc:Doc;
         authorizeUrl: string;
       tokenEndpoint : string;
       revocationEndpoint: string;
       userinfoEndpoint: string;
       issuerEndpoint:string;
        mod:string;
      expo:string;
         keys:Key[];
    }

    export class Key
    {
          kty:string;
          e :string;
          use:string;
          kid:string;
          alg:string;
          n :string;
          keySize:number;
    }

    export class Doc
    {
          raw :string;
       json: Json;
         isError:boolean;
        statusCode:number
         error:any;
       errorType:number;
        exception:any;
      keySet:Keyset;
      issuer:string;
       authorizeEndpoint:string;
        tokenEndpoint:string;
         userInfoEndpoint:string;
      revocationEndpoint:string;
     jwksUri:string;
         responseTypesSupported :string[];
      subjectTypesSupported:string[];
     scopesSupported : string[];
      idTokenSigningAlgValuesSupported:string[];
       tokenEndpointAuthenticationMethodsSupported:string[];
      claimsSupported:string[];
    }

    export class Json
    {
         issuer:string;
          authorization_endpoint : string;
        token_endpoint : string;
         userinfo_endpoint : string;
         revocation_endpoint : string;
       jwks_uri : string;
       response_types_supported : string[];
        subject_types_supported : string[];
         id_token_signing_alg_values_supported: string[];
      scopes_supported : string[];
     token_endpoint_auth_methods_supported: string[];
     claims_supported : string[];
    }

    export class Keyset
    {
       keys:Key[];
    }

    export class Discoveryclient
    {
         authority:any;
        url:string;
       policy:Policy;
    }

    export class Policy
    {
       requireHttps:Boolean;
     validateIssuerName:Boolean;
    }