import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_TITLE, ADMIN, GUEST, ANALYST } from '../../constants/global.constant';
import { UserInfo } from '../../services/userInfo.service';
import { CommunicationService } from '../../services/communication.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public appTitle : string = APP_TITLE;
  //private userIcon: string = 'assets/images/default.png';
  public userImageUrl: string;
  public userData : any;
  public userType : any;
  public guest : string = GUEST;
  public admin : string = ADMIN;
  public analyst : string = ANALYST;

  constructor(private router: Router, private userInfo : UserInfo, private communicationService : CommunicationService) { 
  }
  
  ngOnInit() {
    this.communicationService.getUserInfo().subscribe(userData => this.userData = userData);
    if(this.userData){      
      this.userImageUrl = `http://mysite.corp.lpl.com/User%20Photos/Profile%20Pictures/corp_${this.userData.userName}_MThumb.jpg`;
    }
    this.communicationService.getAccessType().subscribe( userType => this.userType = userType);
    //console.log(' ewqrwer ewrwer wer wer werwer rew',this.userType);
  }


  placeholderUrl() {
    if(!this.userImageUrl)
      this.userImageUrl = 'assets/img/default.png';
  }

  signout() {    
    this.router.navigate(['/signout']);
  }

}
