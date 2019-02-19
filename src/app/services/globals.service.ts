import { Injectable, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Globals {

  private ip:string = null;
	private title = 'ocBlogAngular';
	private version = VERSION.full;


  constructor(private http:HttpClient) { }

  setIp() {
    this.http.get('http://api.ipify.org/?format=json').subscribe(
      (value) => {
        this.ip = value['ip'];
      },
      (error) => {
        this.ip = null;
        console.log('Error: '+error);
      }
    );
  }

  getIp():string {
    return this.ip;
  }
  
  getTitle():string {
    return this.title;
  }

  getVersion():string {
    return this.version;
  }
}