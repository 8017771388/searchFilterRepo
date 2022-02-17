import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) { }

  @Output() confirm = new EventEmitter();

  public title : any;
  public confirmTxt : string;

  ngOnInit() {
  }

  sendConfirmation(){
    this.confirm.emit("true");
    this.bsModalRef.hide();
  }

  declineConfirmation(){
    this.confirm.emit("false");
    this.bsModalRef.hide();
  }

}
