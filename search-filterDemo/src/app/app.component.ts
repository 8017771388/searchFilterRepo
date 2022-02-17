import { Component} from '@angular/core';
import { CommunicationService } from './modules/_shared/services/communication.services';
import { startWith, delay } from 'rxjs/operators';
import { Router,NavigationEnd, Scroll  } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'CFO Admin';
    loader = false;

    constructor(private communicationService: CommunicationService){
    }

    ngAfterViewInit() {
        this.communicationService
            .getLoader()
            .pipe(
                startWith(false),
                delay(0)
            )
            .subscribe(result => (this.loader = result));
    }
}
