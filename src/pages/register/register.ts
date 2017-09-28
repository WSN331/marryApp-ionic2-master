/**
 * Created by ASUS on 2017/9/4 0004.
 */
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  /**
   * 注册的表单数据
   */
  public registerForm = {
    account: '',
    password: '',
    name: '',
    sex: 0,
    age: '',
    hobby: ''
  };

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public alertCtrl:AlertController) {
  }

  /**
   * 注册
   */
  public register() {
    console.log(this.registerForm)
    for (let name in this.registerForm) {
      if (this.registerForm[name] === undefined || this.registerForm[name] === '') {
        this.registerMessage("信息必须填全");
        return;
      }
    }
    this.myHttp.post(MyHttp.URL_REGISTER, this.registerForm, (data) => {
      if (data.registerResult === "0") {
        this.registerMessage("注册成功");
        this.navCtrl.pop();
      } else if (data.registerResult === "1") {
        this.registerMessage("账号已存在");
      }
    })
  }

  /**
   * 注册信息
   * @param subTitle
     */
  private registerMessage(subTitle: string) {
    this.alertCtrl.create({
      title: "注册",
      subTitle: subTitle,
      buttons: ["关闭"]
    }).present();
  }

}
