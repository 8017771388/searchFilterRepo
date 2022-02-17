import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpService } from '../../_shared/services/http.services';
import { AppSettings } from '../../_shared/constants/api-constant';

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {

  constructor(private httpService : HttpService,private http : HttpClient) { }

  getData(param){
    return this.httpService
     .post(AppSettings.profiles, param, AppSettings.apiKey)
     .pipe(map(response => response));
  }

  getFilters(param){
    return this.httpService
     .post(AppSettings.homePage+'/filter', param, AppSettings.apiKey)
     .pipe(map(response => response));
    } 

  saveAdvisorDetails(param){
    return this.httpService
     .post(AppSettings.advisordetails, param, AppSettings.apiKey)
     .pipe(map(response => response));
  }

    getAdvisorData(repid) {
        var url = AppSettings.advisordetailsEdit + repid;
        var separator = url.indexOf('?') === -1 ? '?' : '&';
        url = url + separator + 'noCache=' + new Date().getTime();
    return this.httpService
     .get(url,'', AppSettings.apiKey)
     .pipe(map(response => response));
  }

  searchVcfos(searchText){
      var url = AppSettings.allVcfos + "?search=" + searchText
      var separator = url.indexOf('?') === -1 ? '?' : '&';
      url = url + separator + 'noCache=' + new Date().getTime();
    return this.httpService
    .get(url, {}, AppSettings.apiKey)
    .pipe(map((res: Response) => res["data"]))
  }

  getRepList(param){
    var path = AppSettings.repList + "/" + param;
    var separator = path.indexOf('?') === -1 ? '?' : '&';
    path = path + separator + 'noCache=' + new Date().getTime();
    var arr = [];
    return this.httpService
    .get(path, {}, AppSettings.apiKey)
    .pipe(map((res: Response) => {
      if(res["data"]["primaryrepid"]["name"] !== null){
        arr.push(res["data"]);
      }      
      return arr; 
    }));
  }

  getAdDetail(input) {
    var path = AppSettings.adDetail + "/" + input;
    var separator = path.indexOf('?') === -1 ? '?' : '&';
    path = path + separator + 'noCache=' + new Date().getTime();

    return this.httpService
    .get(path, {}, AppSettings.apiKey)
    .pipe(map(response => response));
    
  }

  saveHomeOfficeUser(param){
    return this.httpService
    .post(AppSettings.homeOfficeUsers, param, AppSettings.apiKey)
    .pipe(map(response => response));
  }

  getAdvisorsByVcfoId(vcfoId) {    
    var url = AppSettings.searchAdvisor + "?vcfoId=" + vcfoId
    var separator = url.indexOf('?') === -1 ? '?' : '&';
    url = url + separator + 'noCache=' + new Date().getTime();
    
    return this.httpService
    .get(url, {}, AppSettings.apiKey)
    .pipe(map(res => res));
  }

  saveAsatFlag(param){
    return this.httpService
    .post(AppSettings.enableCWAccess, param , AppSettings.apiKey)
    .pipe(map(response => response))
  }
}
