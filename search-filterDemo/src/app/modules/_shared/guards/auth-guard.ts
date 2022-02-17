import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { STORAGE_KEY } from '../constants/global.constant';
import { CommunicationService } from '../services/communication.services';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private communicationService: CommunicationService) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const getUserDetails = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
        //console.log(getUserDetails);
        //console.log(this.communicationService.getAccessType);
        //console.log(route.data.role);
        // if (route.data.role && (route.data.role || []).indexOf(getUserDetails.groupType) <= -1) {
        //     this.router.navigate(['dashboard']);
        // }
        return false;
    }
}