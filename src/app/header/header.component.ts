import { Component, OnInit } from '@angular/core';
import { Globals } from '../services/globals.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private globals:Globals) { }
}
