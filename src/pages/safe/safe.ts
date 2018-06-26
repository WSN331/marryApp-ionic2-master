import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';

import { ForgetPage } from '../forget/forget'
import { DeleteUserPage } from '../deleteUser/deleteUser'

@Component({
  selector: 'page-safe',
  templateUrl: 'safe.html'
})
export class SafePage{


  constructor(public navCtrl: NavController) {

  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

  goToResetPassword() {
    this.navCtrl.push(ForgetPage);
  }

  goToDelete() {
    this.navCtrl.push(DeleteUserPage);
  }
}
