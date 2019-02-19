import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Globals } from './services/globals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(private globals:Globals) {
			const config = {
			apiKey: "AIzaSyC40iFrczOUeZaYyGoqy1oRe8e34IdmcAk",
			authDomain: "oc-blog-angular.firebaseapp.com",
			databaseURL: "https://oc-blog-angular.firebaseio.com",
			projectId: "oc-blog-angular",
			storageBucket: "",
			messagingSenderId: "826134827378"
		};
		
		firebase.initializeApp(config);
	}	
	ngOnInit() {
		this.globals.setIp();
	}
}
