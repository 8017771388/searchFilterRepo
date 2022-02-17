export class AdvisorAccessDetailsResponseModel
    {

      tokenResponse:TokenResponseQBO;
      userData:UserData;

    }

    export class TokenResponseQBO
    {
        accessTokenExpiresIn: number;
        errorDescription : number;
         refreshToken : string;
         tokenType : string;
        identityToken : string;
       accessToken: string;
        httpErrorReason :string;
        /* public HttpStatusCode? HttpStatusCode { get; set; }
        public ResponseErrorType? ErrorType { get; set; } */
         isError :Boolean;
        /* public System.Exception Exception { get; set; }
        public JObject Json { get; set; } */
        //public string Raw { get; set; }

       refreshTokenExpiresIn :number;

       error: string;



    }

    export class UserData
    {
        sub : string;
        email:string;
        emailVerified :string;
      givenName:string;
         familyName:string;
         phoneNumber :string;
         phoneNumberVerified :string;
       streetAddress :string;
         locality :string;
         region :string
         postalCode :string;
        country : string;
        IsValidUser : boolean;

    }

