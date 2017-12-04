/**
 * Created by ASUS on 2017/12/4 0004.
 */
import { NavController } from 'ionic-angular';

export class BasePage {

  constructor(public navCtrl: NavController) {}

  /**
   * 返回
   */
  back() {
    this.navCtrl.pop();
  }
}

