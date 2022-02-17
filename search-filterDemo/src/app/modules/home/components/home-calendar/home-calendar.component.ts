import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment'; 
import { HomeService } from '../../services/home.service';
import { UserInfo } from  '../../../_shared/services/userInfo.service';
import { ConfirmModalComponent } from 'src/app/modules/_shared/components/confirm-modal/confirm-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { CorePlanService } from '../../services/core-plan.service';
import { CommunicationService } from 'src/app/modules/_shared/services/communication.services';
import { AddTaskComponent } from 'src/app/modules/_shared/components/add-task/add-task.component';
import { AddTaskCalendarComponent } from '../add-task-calendar/add-task-calendar.component';
import { ANALYST } from '../../../_shared/constants/global.constant';


@Component({
  selector: 'app-home-calendar',
  templateUrl: './home-calendar.component.html',
  styleUrls: ['./home-calendar.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})

export class HomeCalendarComponent implements OnInit {

  @Input() repId: string;
  
  constructor(private homeService : HomeService, private userInfo : UserInfo, private modalService : BsModalService, private corePlaService : CorePlanService, private communicationService : CommunicationService) { }

  public selected : any = null;
  public month : any;
  public start : any;
  public scope : any = this;
  public weeks : any;
  public currentUser : any;
  public calenderViewData : any = null;
  public showCalenderView : boolean = false;
  public coppiedCalenderData : any = null;
  public bsModalRef : BsModalRef;
  public userType : any;
  public activeFilter : string = 'all';
  public analyst : string = ANALYST;
  public dropDownMonths : any = [];
  public dropDownYears : any = [];
  public monthTxt : string = 'Month';
  public yearTxt : number = 0;
  public selectedMonth : number = 0;
  public selectedYear : number = 0;
  private dateRangeObject : any = {'start': '', 'end': ''};

  ngOnInit() {    
    this.communicationService.getAccessType().subscribe( userType => this.userType = userType);
    this.currentUser = this.userInfo._currentUserFn();
    this.loadCalendar();     

    this.dropDownMonths = [{'number':1,'name':'January','enable':true},{'number':2,'name':'February','enable':true},{'number':3,'name':'March','enable':true},{'number':4,'name':'April','enable':true},{'number':5,'name':'May','enable':true},{'number':6,'name':'June','enable':true},{'number':7,'name':'July','enable':true},{'number':8,'name':'August','enable':true},{'number':9,'name':'September','enable':true},{'number':10,'name':'October','enable':true},{'number':11,'name':'November','enable':true},{'number':12,'name':'December','enable':true}];

    this.dropDownYears = [];
    let dt = new Date();
    let cuurentYear = dt.getFullYear();
    let monthsArr    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    this.selectedMonth = dt.getMonth();
    this.selectedYear = cuurentYear;
    let cuurentMonth = monthsArr[dt.getMonth()];
    this.monthTxt = cuurentMonth;
    this.yearTxt = cuurentYear;
    for(let i = 2019; i <= cuurentYear + 10; i++){
      this.dropDownYears.push(i);
    }
  }


  loadCalendar(){
    
    this.selected = this.removeTime(this.selected || moment());
    this.month = this.selected.clone();
    this.start = this.selected.clone();
    this.start.date(1);
    this.removeTime(this.start.day(0));
    this.buildMonth(this.start, this.month);
    
    const startOfMonth = moment().startOf('month').format('MM-DD-YYYY');
    const endOfMonth   = moment().endOf('month').format('MM-DD-YYYY');
    
    var param = {username : this.currentUser.userName,
                vcfoOrAdvisor : '',
                fromDate : startOfMonth,
                toDate : endOfMonth,
                repId : this.repId
              };
    this.getCalendarView(param);
    
  }

  getCalendarView(param){
    this.dateRangeObject.start = param.fromDate;
    this.dateRangeObject.end = param.toDate;
    this.communicationService.displayLoader(true);
    this.homeService.getCalenderView(param).subscribe( result => {
      this.calenderViewData = result;
      if(this.weeks.length > 0){
        this.weeks.forEach((week, index) => {
          week.days.forEach(day => {
            day.vcfoTaskList = [];
            day.advisorTaskList = [];
            day.showTooltip = false;
            day.tooltipTitle = '';
            day.isWeekend = this.isWeekend(day.date.toDate());
            day.isSaturday = this.isSaturday(day.date.toDate());
            if(this.calenderViewData.data.advisorTaskList.length > 0){
              this.calenderViewData.data.advisorTaskList.forEach(item => {
                item.advisorTask = true;
                item.cfoTask = false;
                if(day.date.isSame(item.dueDate)){
                  day.advisorTaskList.push(item);                  
                }
              });
            }
            if(this.calenderViewData.data.vcfoTaskList.length > 0){
              this.calenderViewData.data.vcfoTaskList.forEach(item => {
                item.advisorTask = false;
                item.cfoTask = true;
                if(day.date.isSame(item.dueDate)){
                  day.vcfoTaskList.push(item);
                  day.showTooltip = false;
                  day.tooltipTitle = '';
                }
              });
            }
          });
        });
        this.showCalenderView = true;
        this.coppiedCalenderData = JSON.parse(JSON.stringify(this.weeks));
        this.communicationService.clearLoader();
      }
    })
  }

  isWeekend(date1){
    var dt = new Date(date1);     
    if(dt.getDay() == 6 || dt.getDay() == 0)
    {
      return true;
    }
    return false;
  }

  isSaturday(date1){
    var dt = new Date(date1);     
    if(dt.getDay() == 6)
    {
      return true;
    }
    return false;
  }

  

  /**** ---- Code block for nest and previous button function ----

  // select(day) {
  //   this.selected = day.date;
  // };

  // next() {
  //   var next = this.month.clone();
  //   this.removeTime(next.month(next.month() + 1).date(1));
  //   this.month.month(this.month.month() + 1);
  //   this.buildMonth(next, this.month);
  // };

  // previous() {
  //   var previous = this.month.clone();
  //   this.removeTime(previous.month(previous.month() - 1).date(1));
  //   this.month.month(this.month.month() - 1);
  //   this.buildMonth(previous, this.month);
  // };

  -------- Code block for nest and previous button function -------- ****/

  removeTime(date) {
    return date.day(0).hour(0).minute(0).second(0).millisecond(0);
  }

  buildMonth(start, month) {
    this.weeks = [];
    var done = false,
      date = start.clone(),
      monthIndex = date.month(),
      count = 0;
    while (!done) {
      this.weeks.push({
        days: this.buildWeek(date.clone(), month)
      });
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
  }

  buildWeek(date, month) {
    var days = [];
    for (var i = 0; i < 7; i++) {
      days.push({
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      });
      date = date.clone();
      date.add(1, "d");
    }
    return days;
  }

  filterCalender(filterFor){
    this.activeFilter = filterFor;
    this.weeks = JSON.parse(JSON.stringify(this.coppiedCalenderData));
    if(filterFor !== 'all'){
      if(this.weeks.length > 0){
        this.weeks.forEach((week, index) => {
          week.days.forEach(day => {
            if(filterFor == 'mytask'){
              day.advisorTaskList = [];
            }else if(filterFor == 'advisortask'){
              day.vcfoTaskList = [];
            }
          });
        });
      }
    }
  }

  showTooltip(day, dataToShow){

    this.weeks.forEach((week, index)=>{
      week.days.forEach((day, i) => {
        day.showTooltip = false;
        day.tooltipData = [];
      });
    })

    if(dataToShow == 'all'){
      day.tooltipData = [...day.advisorTaskList, ...day.vcfoTaskList];
      day.tooltipTitle = "All Tasks";
    }else{
      day.tooltipData = day[dataToShow];      
      if(dataToShow == 'vcfoTaskList')
        day.tooltipTitle = 'My Tasks';
      else
        day.tooltipTitle = "Advisor Tasks";
    }
    if(day.tooltipData.length > 0)
      day.showTooltip = true;
  }

  deleteTask(taskDet, i , day){
    let initialState = {
      title: 'Delete Task',
      confirmTxt : 'Are you sure you want to delete the task?'
    };

    this.bsModalRef = this.modalService.show(ConfirmModalComponent, {initialState, backdrop: 'static', keyboard: true, ignoreBackdropClick: false,  class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.confirm.subscribe(value => {
      if(value === 'true'){
        this.communicationService.displayLoader(true);
        var deleteTaskObj = {
          actionPlanId: taskDet.actionPlanId,
          actionPlanDetailId: taskDet.actionPlanDetailId,
          username: this.currentUser.userName,
        };

        this.corePlaService.deleteTask(deleteTaskObj).subscribe((response : any) => {
          if(response.status == 'success'){
            this.bsModalRef.hide();
            this.communicationService.clearLoader();
            day.tooltipData.splice(i,1);
            if(day.tooltipData.length <= 0){
              day.showTooltip = false;
              day.tooltipTitle = '';
            }
          }
        })
        this.communicationService.clearLoader();
      }
    })
  }

  editTask(taskDet, i, day){
    var advisorDet;
    this.communicationService.getPlanData().subscribe(data => {
      advisorDet = data;
    });
    var goalDet = {
      'goal' : taskDet.goal,
      'goalDescription' : taskDet.goal,
      'goalId' : taskDet.goalId,
      'repId' : advisorDet.repId
    }
    let initialState = {
      currentUser : this.currentUser,
      taskData: taskDet,
      goalDetail : goalDet,
      advisorDetail : advisorDet,      
      userType: this.userType,
      title: 'Edit Task',
      openFrom : 'core-plan',
      type : 'calendar'
    };
    
    this.bsModalRef = this.modalService.show(AddTaskComponent, {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.taskSaved.subscribe(value => {
      if(value){
        var param = {
          username : this.currentUser.userName,
          vcfoOrAdvisor : '',
          fromDate : this.dateRangeObject.start,
          toDate : this.dateRangeObject.end,
          repId : this.repId
        };
        
        this.getCalendarView(param);
        //this.loadCalendar(); 
      }
    })
  }

  addTask(day) {
    let initialState = {
      repId : this.repId,
      userName : this.currentUser.userName,
      dueDate : moment(day.date).format('ll')
    };
    
    this.bsModalRef = this.modalService.show(AddTaskCalendarComponent , {initialState, backdrop: 'static', class: 'modal-lg'});
    this.bsModalRef.content.addTaskResp.subscribe(value => {
      if(value === 'true'){
        var param = {
          username : this.currentUser.userName,
          vcfoOrAdvisor : '',
          fromDate : this.dateRangeObject.start,
          toDate : this.dateRangeObject.end,
          repId : this.repId
        };
        
        this.getCalendarView(param);
        //this.loadCalendar();
      }
    })
  }

  getMonthDateRange(year, month) {
    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    var startDate = moment([year, month - 1]);

    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf('month');

    // make sure to call toDate() for plain JavaScript date type
    return { start: startDate.toDate(), end: endDate.toDate() };
  }

  selectMonth(selMonth){
    if(selMonth != this.monthTxt){
      this.monthTxt = selMonth.name;
      this.selectedMonth = selMonth.number;
      if(this.yearTxt != 0 && this.monthTxt != 'Month'){
        let dateRange = this.getMonthDateRange(this.selectedYear, this.selectedMonth);
        this.generateMonthCalender(dateRange);
        
      }
    }
  }
 
  selectYear(selYear){
    if(selYear != this.yearTxt){
      this.yearTxt = selYear;
      this.selectedYear = selYear;
      if(this.yearTxt != 0 && this.monthTxt != 'Month'){
        let dateRange = this.getMonthDateRange(this.selectedYear, this.selectedMonth);
        this.generateMonthCalender(dateRange);
        var param = {
          username : this.currentUser.userName,
          vcfoOrAdvisor : '',
          fromDate : moment(dateRange.start).format('MM-DD-YYYY'),
          toDate : moment(dateRange.end).format('MM-DD-YYYY'),
          repId : this.repId
        };
      }
    }
  }


generateMonthCalender(dateRange){

  //dateRange is a object of start and end date
  //fetching all the dates of the perticular month
  let allDates = this.enumerateDaysBetweenDates(moment(dateRange.start).subtract(1, 'days').format('MM-DD-YYYY'), moment(dateRange.end).add(1, 'days').format('MM-DD-YYYY'));
  
  //doing all the dates as blank by itarating through the weeks array of day objects
  this.weeks.forEach((week, index)=>{
    week.days.forEach((day, i) => {
      day.date = '';// assigning date as blank
      day.showTooltip = false;
      day.tooltipData = [];
    });
  })

  //if there is 6 weeks then deleting the last week from the week array
  if(this.weeks.length > 5){
    this.weeks.splice(5,1);
  }

    var index = 0; // index is taking to fetch the date from the allDates array
    var dayCount = 1; // dayCount is taking to count the no of days in a month
    this.weeks.forEach((week, i)=>{ // itaration for fetching the week from the weeks array of objects
      week.days.forEach((day, j) => {  // itaration for fetching the days from the week array of objects 
        //if(day.date === ''){
          day.date = ''; // explicitly assigning date as blank
          if(moment(allDates[index]).day() == j && index < allDates.length){ // checking the day(Ex : Sunday, monday or any other day) of the dates from the all day array with the day of the days  
            day.date = moment(allDates[index]); //true : assigning the date of alldates in to the date of days array
            day.isCurrentMonth = true; 
            day.number =  moment(allDates[index]).date(); // geeting date number
            day.isToday = false
            if(allDates.length > index) // checking if allDates array length is greater than index ( because we have to take the dates in the allDates array)
              index++; // increasing index to take the next date from allDates array
          }else{ // False
            day.date = ''; // explicitly assigning date as blank
            day.isCurrentMonth = false;
            day.isToday = false
            var m = j + 1; // m is the counter to fetch the previous dates before start dates 
            for(let k = 0; k<=j; k++){   //itaration for fetching the dates which is not in the month(allDates array) but in calendar grid            
              if(dayCount > allDates.length){ // checking for the dates after the month (dates of next month which will show in calendar)
                day.date = moment(week.days[j - 1].date).add(1, 'days'); // adding one day with the just before date
                day.number = moment(day.date).date();
              }else{ // checking for the dates previous the month (dates of previous month which will show in calendar)
                  week.days[k].date = moment(allDates[0]).subtract(m, 'days');   // subtracting days from the start date of the month
                  week.days[k].number =  week.days[k].date.date();                           
              }
              m--;
              day.isToday = false;             
            }
          }
        dayCount++;
      });

      //checking for the last week of the month that we need or not. if index is not equal to allDates count then means there is some days still left
      //which is not in the calendar. Now adding last week to the weeks array and doing the same checking which have done previosly 
      if(index < dayCount && index < allDates.length && this.weeks.length == 5 && i == 4){
        this.weeks[i+1] = {'days' : JSON.parse(JSON.stringify(week.days))};
        this.weeks[i+1].days.forEach((day, j) => {  
            day.date = '';
            if(moment(allDates[index]).day() == j && index < allDates.length){
              day.date = moment(allDates[index]);
              day.isCurrentMonth = true;
              day.number =  moment(allDates[index]).date();
              if(allDates.length > index)
                index++;
            }else{
              day.date = '';
              day.isCurrentMonth = false;
              var m = j + 1;
              for(let k = 0; k<=j; k++){              
                if(index >= allDates.length){
                  day.date = moment(this.weeks[i+1].days[j-1].date).add(1, 'days');
                  day.number = day.date.date();
                }else{
                  this.weeks[i+1].days[k].date = moment(allDates[0]).subtract(m, 'days');   
                  this.weeks[i+1].days[k].number =  this.weeks[i+1].days[k].date.date();                           
                }
                m--;             
              }
            }
          dayCount++;
        });
      }else{
        // if index is equal to allDates count then all dates are already putted into Calendar. Then checking for if there is any extra weeks or not
        // if there is extra week in weeks array then removing it from weeks array.
        if(index == allDates.length && this.weeks.length == 6 && i == 4){
          this.weeks.splice(5,1);
        }
      }
    })
    // creating params to fecth the month data
    var param = {
      username : this.currentUser.userName,
      vcfoOrAdvisor : '',
      fromDate : moment(dateRange.start).format('MM-DD-YYYY'),
      toDate : moment(dateRange.end).format('MM-DD-YYYY'),
      repId : this.repId
    };
    
    this.getCalendarView(param);
}

enumerateDaysBetweenDates(startDate, endDate) {
  var dates = [];

  var currDate = moment(startDate).startOf('day');
  var lastDate = moment(endDate).startOf('day');

  while(currDate.add(1, 'days').diff(lastDate) < 0) {
      dates.push(currDate.clone().toDate());
  }

  return dates;
};

}
