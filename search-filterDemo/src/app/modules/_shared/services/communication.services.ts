import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';


@Injectable()
export class CommunicationService {
    private loggedin = new BehaviorSubject(null);
    private userInfo = new BehaviorSubject<any>(null);
    private loader = new BehaviorSubject<boolean>(false);
    private logger = new Subject<any>();
    private accessType = new BehaviorSubject(null);
    private planData = new BehaviorSubject<any>(null);
    private allCfos = new BehaviorSubject<any>(null);
    public masterAdvisor = new BehaviorSubject<any>(null);
    public splitAdvisor = new BehaviorSubject<any>(null);


    constructor() {
    }

    setAccessType(accessType) {
        this.accessType.next(accessType);
    }

    getAccessType(): Observable<boolean> {
        return this.accessType.asObservable();
    }

    getLoggedInType(): Observable<boolean> {
        return this.loggedin.asObservable();
    }

    setLoggedinType(type: boolean): void {
        this.loggedin.next(type);
    }

    clearLoggedinType(): void {
        this.loggedin.next(null);
    }

    getUserInfo(): Observable<any> {
        return this.userInfo.asObservable();
    }

    setUserInfo(data: any): void {
        this.userInfo.next(data);
    }

    clearUserInfo(): void {
        this.userInfo.next(null);
    }

    getLoader(): Observable<boolean> {
        return this.loader.asObservable();
    }

    displayLoader(data: boolean): void {
        this.loader.next(data);
    }

    clearLoader(): void {
        this.loader.next(false);
    }

    getLogger(): Observable<any> {
        return this.logger.asObservable();
    }

    setLogger(data): void {
        this.logger.next(data);
    }

    clearLogger(): void {
        this.logger.next(false);
    }

    getPlanData() : Observable<any> {
        return this.planData.asObservable();
    }

    setPlanData(data) : void {
        this.planData.next(data);
    }

    getCFO() : Observable<any> {
        return this.allCfos.asObservable();
    }

    setCFO(data) : void {
        this.allCfos.next(data);
    }

    setMasterAdvisor(data) : void {
        this.masterAdvisor.next(data);
    }

    getMasterAdvisor() : Observable<any> {
        return this.masterAdvisor.asObservable();
    }

    setSplitAdvisor(data) : void {
        this.splitAdvisor.next(data);
    }

    getSplitAdvisor() : Observable<any> {
        return this.splitAdvisor.asObservable();
    }

}
