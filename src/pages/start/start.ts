/**
 * Created by ASUS on 2017/8/29 0029.
 */
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {RegisterPage} from '../register/register';
import {EveryPersonPage} from "../every-person/every-person";
import {Memory} from "../../util/Memory";
import {TabsPage} from "../tabs/tabs";


@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  constructor(public navCtrl:NavController,public memory:Memory) {
  }


  ionViewDidLoad() {
    console.log("starting");
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }

  goToSeeEachPerson() {
    this.navCtrl.push(EveryPersonPage);
  }

}
