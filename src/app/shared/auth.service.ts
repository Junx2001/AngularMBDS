import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { GlobalConstants } from './global-constants';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  uri = GlobalConstants.urlAPI+"/users";
  private userSubject: BehaviorSubject<any>;

  setUserSubject(user: any) {
    this.userSubject.next(user);
  }

  getUserSubject(): Observable<any> {
    return this.userSubject.asObservable();
  }

  constructor(private http:HttpClient, @Inject(DOCUMENT) private document: Document) {
    this.userSubject = new BehaviorSubject(null);
  }

  isLoggedIn(){
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      return (localStorage.getItem('token')===undefined || localStorage.getItem('token')===null || localStorage.getItem('token')==='') ? false : true;
    }
    return false;
  }
  login(email:string, password:string):Observable<any>{
    this.loggedIn=true;
    const body = {"email": email, "password": password};
    return this.http.post<any>(this.uri+"/login", body,{'headers':this.getHeaders(false,false)})
    .pipe(
      catchError((data:any)=>{
        return of(data.error);
      }
      )
    )
  }
  logOut(){
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      this.loggedIn=false;
      localStorage.clear();
    }
  }
  getCurrentUser(){
    return this.http.get<any>(this.uri + "/profile", {'headers':this.getHeaders()})
    .pipe(
      catchError((data:any)=>{
        return of(data.error);
      })
    );
  }
  isAdmin(){
    const isUserAdmin = new Promise(
      (resolve, reject)=>{
        this.getCurrentUser()
        .subscribe((response) => {
          if (response.success) {
            const userdata = response.data;
            resolve(userdata.user.role==="ROLE_USER_PROFESSOR");
          } else {
            reject(response.message);
          }
        });
      }

    );
    return isUserAdmin;
  }
  register(formdata:FormData):Observable<any>{
    return this.http.post<any>(this.uri+"/signup", formdata,{'headers':this.getHeaders(true,false)})
    .pipe(
      catchError((data:any)=>{
        return of(data.error);
      }
      )
    )
  }
  updateUser(formdata:FormData):Observable<any>{
    return this.http.put<any>(this.uri + "/update", formdata, {'headers':this.getHeaders(true)})
    .pipe(
      catchError((data:any)=>{
        return of(data.error);
      })
    );
  }
  getHeaders(isFormData:boolean=false, needAuthToken:boolean=true):HttpHeaders{
    let headers = new HttpHeaders();
    if (isFormData) {
      headers = headers.append('enctype', 'multipart/form-data');
    }else{
      headers = headers.append('content-type', 'application/json');
    }
    headers = headers.append('Access-Control-Allow-Origin', '*');
    if (needAuthToken){
      const localStorage = this.document.defaultView?.localStorage;
      if (localStorage) {
        headers = headers.append('auth-token', localStorage.getItem('token')!=undefined ? ''+localStorage.getItem('token') : '');
      }
    }
    return headers;
  }
}
