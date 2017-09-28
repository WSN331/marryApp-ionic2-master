/**
 * Created by ASUS on 2017/8/29 0029.
 */
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LoginPage} from "../login/login";
import { RegisterPage } from '../register/register';
import {EverypersonPage} from "../everyperson/everyperson";


@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  constructor(public navCtrl: NavController) {

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

  goToSeeEachPerson(){
    this.navCtrl.push(EverypersonPage);
  }



}
