import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'

import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})

export class ForgetPage {

  constructor(public navCtrl: NavController, private myHttp : MyHttp, public alertCtrl: AlertController, public memory: Memory) {
  }

  /**
   * 找回密码表单数据
   * @type {{account: string, password: string}}
     */
  public forgetForm = {
    account: '',
    code:'',
    newPassword: ''
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
   * 找回密码控制
   */
  getPassword() {
    let rulePhone = /^1[3|4|5|7|8][0-9]{9}$/;
    let rulePas = /^[a-zA-Z0-9]{6,20}$/;
    console.log(this.forgetForm)
    for(let name in this.forgetForm){
      if (typeof this.forgetForm[name] === "undefined" || this.forgetForm[name] === "") {
        this.loginFailError("请将信息填写完整");
        return;
      }
    }
    if(!rulePhone.test(this.forgetForm.account)){
      this.loginFailError("请输入正确的手机号码");
      return;
    }
    if(!rulePas.test(this.forgetForm.newPassword)){
      this.loginFailError("请按密码格式输入");
      return;
    }

/*    if (typeof this.forgetForm.account === "undefined" || this.forgetForm.account === "") {
      this.loginFailError("账号不能为空");
    }else if(typeof this.forgetForm.code === "undefined" || this.forgetForm.code === ""){
      this.loginFailError("请输入验证码");
    }else if (typeof this.forgetForm.newPassword === "undefined" || this.forgetForm.newPassword === "") {
      this.loginFailError("密码不能为空");
    } */

      //找回密码逻辑
/*      this.myHttp.post(MyHttp.URL_LOGIN, this.forgetForm, (data) => {
        console.log(data)
        let loginResult = data.loginResult;
        if (loginResult==='3') {
          this.loginFailError("账号不存在");
        } else if (loginResult === '2') {
          this.loginFailError("密码错误");
        } else if(loginResult === '2'){
          console.log(data.user)
          this.memory.setUser(data.user);
          this.navCtrl.push(TabsPage);
        }
      })*/
  }

  /**
   * 找回密码失败的提示框
   * @param subTitle
     */
  loginFailError(subTitle: string) {
    this.alertCtrl.create({
      title: "找回失败",
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

}
