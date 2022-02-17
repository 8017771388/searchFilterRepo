import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpService } from './modules/_shared/services/http.services';
import { CommunicationService } from './modules/_shared/services/communication.services';
import { PageTitle } from './modules/_shared/services/page-title.service';
import { FormsModule } from '@angular/forms';
import { HozXhrInterceptor } from './modules/_shared/services/hozXhrInterceptor.service';
import { AuthenticationService } from './modules/_shared/services/authentication.service';
import { UserInfo } from './modules/_shared/services/userInfo.service';
import { SharedModule } from './modules/_shared/shared.module';
import { AuthGuardService } from './modules/_shared/guards/auth.guard';
import { JWTService } from './modules/_shared/services/jwt.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImportadvisorComponent } from './app/modules/quickbook/importadvisor/importadvisor.component';


@NgModule({
  declarations: [
    AppComponent,
    ImportadvisorComponent   
  ],
  imports: [
	BrowserModule,
  HttpClientModule,
  BrowserAnimationsModule,
	FormsModule,
    AppRoutingModule,
      SharedModule,    
    ModalModule.forRoot()
  ],
  providers: [  HttpService,
    CommunicationService,
    PageTitle,
    AuthenticationService,
    UserInfo,
    HttpClientModule,
    AuthGuardService,
    JWTService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HozXhrInterceptor,
        multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
