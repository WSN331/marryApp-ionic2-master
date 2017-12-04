import { Component } from '@angular/core';
import {NavController} from "ionic-angular";

@Component({
  selector: 'page-authorInformation',
  templateUrl: 'authorInformation.html'
})
export class AuthorInformationPage {

  constructor(public navCtrl: NavController){}

  back(){
    this.navCtrl.pop();
  }
}
