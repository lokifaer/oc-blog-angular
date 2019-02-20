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
          resolve(true);
        }
        else {
          setTimeout(()=>{
            if (this.globals.getIp()) {
              resolve(true);
            }
            else {
              reject(false);
            }
          },2000);
          
        }
      }
    );
  }
}
