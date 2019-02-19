import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Globals } from './globals.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RootGuardService implements CanActivate {

  constructor(private globals:Globals) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve, reject) => {
        this.globals.setIp();
        if (this.globals.getIp()) {
          // console.log('1');
          resolve(true);
        }
        else {
          setTimeout(()=>{
            if (this.globals.getIp()) {
              // console.log('2');
              resolve(true);
            }
            else {
              // console.log('3');
              reject(false);
            }
          },2000);
          
        }
      }
    );
  }
}
