import {ChangeDetectorRef, Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';


@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})

export class ForgetPage {

  /**
   * 找回密码表单数据
   * @type {{account: string, password: string}}
   */
  public forgetForm = {
    account: '',
    verifyCode:'',
    newPassword: ''
  }

  //界面刷新
  public getCode = "获取验证码";
  public show = "click";
  public timeShow = 60;
  public timer;

  constructor(public navCtrl: NavController, private myHttp : MyHttp,
              public alertCtrl: AlertController, public changeDetectorRef:ChangeDetectorRef) {
  }

  ngReFresh(){
    //设置一个定时器，每秒刷新该界面
    this.timer = setInterval(()=>{
      this.changeDetectorRef.detectChanges();
      if(this.timeShow>=1){
        this.timeShow -= 1;
        this.show="unclick";
        this.getCode = "获取验证码 ("+this.timeShow+")";
      }else{
        this.show="click";
        this.getCode="获取验证码"
        clearInterval(this.timer);
      }
      console.log("1");
    },1000);
  }

  //password类型
  public pasType="text";
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

      //找回密码逻辑
      this.myHttp.post(MyHttp.URL_GET_PAS, this.forgetForm, (data) => {
        console.log(data)
        let loginResult = data.resetPasswordResult;
        if (loginResult==='0') {
          this.loginFailError("修改成功请登录");
          clearInterval(this.timer);
          this.changeDetectorRef.detach();
          this.navCtrl.pop();
        } else if (loginResult === '1') {
          this.loginFailError("账号不存在");
        } else if (loginResult === '2') {
          this.loginFailError("验证码错误");
        }
      })
  }

  /**
   * 发送验证码
   */
  sendVerify(event : Event) {
    event.stopPropagation();
    console.log("xxxxxx")
    if(this.show == "click"){
      this.ngReFresh()
      this.timeShow = 60;
      this.myHttp.post(MyHttp.URL_SEND_VERIFY, {
        phone: this.forgetForm.account
      }, (data) => {
        console.log(data);
        if (data.sendResult === "0") {
          this.loginFailError("发送验证码成功，请在10分钟内验证");
        } else if (data.sendResult === "1") {
          this.loginFailError("发送验证码失败：" + data.message);
        }
      })
    }
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
    clearInterval(this.timer);
    this.changeDetectorRef.detach();
    this.navCtrl.pop();
  }

}
