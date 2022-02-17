import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quickbook',
  templateUrl: './quickbook.component.html',
  styleUrls: ['./quickbook.component.scss']
})
export class QuickbookComponent implements OnInit {

  public status: any = false;
  constructor(private router: Router) { 

    
  }

  ngOnInit() {
  }
  clickEvent() {
    console.log(this.router.url);
    this.status = !this.status;
  }
}
