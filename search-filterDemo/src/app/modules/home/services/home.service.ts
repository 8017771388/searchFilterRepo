import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import {  Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../_shared/services/http.services';
import { AppSettings } from '../../_shared/constants/api-constant';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

   constructor(private httpService : HttpService,private http : HttpClient){}

     getData(param){
       return this.httpService
        .post(AppSettings.homePage, param, AppSettings.apiKey)
        .pipe(map(response => response));
     }   

     getFilters(param){
      return this.httpService
       .post(AppSettings.homePage+'/filter', param, AppSettings.apiKey)
       .pipe(map(response => response));
    } 

    getCalenderView(param){
      return this.httpService
       .post(AppSettings.calenderView, param, AppSettings.apiKey)
       .pipe(map(response => response));
    }
     
   }
