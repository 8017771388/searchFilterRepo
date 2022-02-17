import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './quickbook.routing.module';
import { SharedModule } from '../_shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { ImportadvisorComponent } from './components/importadvisor/importadvisor.component';
import { CoamaintenanceComponent } from './components/coamaintenance/coamaintenance.component';
import { AdvisoronboardingComponent } from './components/advisoronboarding/advisoronboarding.component';
import { CoamasterdataComponent } from './components/coamasterdata/coamasterdata.component';
import { EqblplconnectComponent } from './components/eqblplconnect/eqblplconnect.component';
import { QuickbookComponent } from "./quickbook.component";
import { JeviewComponent } from './components/jeview/jeview.component';
import { QuickbookService } from './services/quickbook.service';

import { DxDataGridModule } from 'devextreme-angular';

import { TabsModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap';


@NgModule({
	declarations: [ImportadvisorComponent,AdvisoronboardingComponent,CoamaintenanceComponent,CoamasterdataComponent,EqblplconnectComponent,QuickbookComponent,JeviewComponent],
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
        ImportadvisorComponent,
        AdvisoronboardingComponent,
        CoamaintenanceComponent,
        CoamasterdataComponent,
        EqblplconnectComponent,
		QuickbookComponent,
		JeviewComponent	],
	providers: [QuickbookService]
})
export class QuickbookModule { }
