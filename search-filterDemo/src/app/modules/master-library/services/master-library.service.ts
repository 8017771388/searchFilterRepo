import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../_shared/services/http.services';
import { AppSettings } from '../../_shared/constants/api-constant';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MasterLibraryService {

  constructor(private httpService : HttpService, private router : Router) { }

    getAllCategories() {
        var url = AppSettings.categories;
        var separator = url.indexOf('?') === -1 ? '?' : '&';
        url = url + separator + 'noCache=' + new Date().getTime();
    return this.httpService
        .get(url, {}, AppSettings.apiKey)
    .pipe(map(response => response));  
  }

  updateCategory(param){
    return this.httpService
    .post(AppSettings.categories, param, AppSettings.apiKey)
    .pipe(map(response => response));
  }

  deleteCategory(param){
    var uri = AppSettings.categories+'/'+param.categoryId+'_'+param.userName;
    return this.httpService
    .delete(uri, {}, AppSettings.apiKey)
    .pipe(map(response => response));
  }

  getAllGoals(categoryId, searchTxt) {
      var uri = AppSettings.goals + '/' + categoryId;
      
      if (searchTxt) {
          uri = uri + '?search=' + searchTxt;
          var separator = uri.indexOf('?') === -1 ? '?' : '&';    
          uri = uri + separator + 'noCache=' + new Date().getTime();
      }
    return this.httpService
    .get(uri, {}, AppSettings.apiKey)
    .pipe(map(response => response));
  }

  updateGoal(param){
    return this.httpService
    .post(AppSettings.goals, param, AppSettings.apiKey)
    .pipe(map(response => response));
  } 
    updateTask(param) {
        return this.httpService
            .post(AppSettings.tasks, param, AppSettings.apiKey)
            .pipe(map(response => response));
    } 
  deleteGoal(param){
    var uri = AppSettings.goals+'/'+param.goalId+'_'+param.userName;
    return this.httpService
    .delete(uri, {}, AppSettings.apiKey)
    .pipe(map(response => response));
  }
  deleteTask(param) {
        var uri = AppSettings.tasks + '/' + param.taskId + '_' + param.userName;
        return this.httpService
            .delete(uri, {}, AppSettings.apiKey)
            .pipe(map(response => response));
    }

  getAllTasks(goalId, categoryId, searchTxt){
    if(!goalId)
      goalId = 0;
      var uri = AppSettings.tasks + '/' + goalId;     
    if(searchTxt){
      if(!categoryId){
        categoryId = 0;
      }
        uri = uri + '?categoryId=' + categoryId + '&search=' + searchTxt;
        var separator = uri.indexOf('?') === -1 ? '?' : '&';
        uri = uri + separator + 'noCache=' + new Date().getTime();
    }
    return this.httpService
    .get(uri, {}, AppSettings.apiKey)
    .pipe(map(response => response));
  }
}
