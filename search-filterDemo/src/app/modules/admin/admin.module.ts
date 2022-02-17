import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing.module';
import { SharedModule } from '../_shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { AdvisorProfileComponent } from './components/advisor-profile/advisor-profile.component';
import { HomeProfileComponent } from './components/home-profile/home-profile.component';
import { AdvisorService } from './services/advisor.service';
import { HomeService } from './services/home.service';
import { DxDataGridModule } from 'devextreme-angular';
import { AdvisorSubcriptionComponent } from './components/advisor-subcription/advisor-subcription.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { TabsModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap';


@NgModule({
	declarations: [AdvisorProfileComponent, AdminPageComponent, AdvisorSubcriptionComponent , HomeProfileComponent],
	imports: [
		CommonModule,
		AdminRoutingModule,
		SharedModule,
		DxDataGridModule,
		TabsModule.forRoot(),
		BsDatepickerModule.forRoot(),
		TypeaheadModule.forRoot()
	],
	exports: [
		AdvisorProfileComponent
	],
	providers: [AdvisorService,HomeService]
})
export class AdminModule { }
