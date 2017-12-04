import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'

import {TabsPage} from "../tabs/tabs";
import {ForgetPage} from "../forget/forget";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  constructor(public navCtrl: NavController, private myHttp : MyHttp,
              public alertCtrl: AlertController, public memory: Memory) {
  }


  /**
   * 登录表单数据
   * @type {{account: string, password: string}}
     */
  public loginForm = {
    account: '',
    password: ''
  }
  //password类型
  public pasType="password";
  showPas(){
    console.log("change");
    if(this.pasType=="password"){
      this.pasType="text";
    }else{
      this.pasType="password";
    }
  }

  /**
   * 登录控制
   */
  login() {
    let rulePhone = /^1[3|4|5|7|8][0-9]{9}$/;
    let rulePas = /^[a-zA-Z0-9]{6,20}$/;
    console.log(this.loginForm)
    if (typeof this.loginForm.account === "undefined" || this.loginForm.account === "") {
      this.loginFailError("账号不能为空");
      return;
    }
    if (typeof this.loginForm.password === "undefined" || this.loginForm.password === "") {
      this.loginFailError("密码不能为空");
      return;
    }
/*    if(!rulePhone.test(this.loginForm.account)){
      this.loginFailError("请输入正确的手机号码");
      return;
    }
    if(!rulePas.test(this.loginForm.password)){
      this.loginFailError("请按密码格式输入");
      return;
    }*/

    this.myHttp.post(MyHttp.URL_LOGIN, this.loginForm, (data) => {
      console.log(data)
      let loginResult = data.loginResult;
      if (loginResult==='2') {
        this.loginFailError("账号不存在");
      } else if (loginResult === '1') {
        this.loginFailError("密码错误");
      } else {
        console.log(data.user)
        this.memory.setUser(data.user);
        this.navCtrl.push(TabsPage);
      }
    })
  }

  /**
   * 登录失败的提示框
   * @param subTitle
     */
  loginFailError(subTitle: string) {
    this.alertCtrl.create({
      title: "登录失败",
      subTitle: subTitle,
      buttons: ["关闭"]
    }).present();
  }

  /*
  * 将该页面拿出堆栈
  * */
  back(){
    this.navCtrl.pop();
  }

  /**
   * 去到找回密码界面
   */
  gotoForget(){
    this.navCtrl.push(ForgetPage);
  }

}
