/**
 * Created by ASUS on 2017/8/29 0029.
 */
import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';

import {LoginPage} from "../login/login";
import {RegisterPage} from '../register/register';
import {EveryPersonPage} from "../every-person/every-person";
import {Memory} from "../../util/Memory";
import {MyStorage} from "../../util/MyStorage";
import {TabsPage} from "../tabs/tabs";


@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  public isLoginOnce = true;

  constructor(public navCtrl:NavController,public memory:Memory,public myStorage:MyStorage,
              public alertCtrl: AlertController) {

    this.isLoginBefore()
  }

  ionViewDidLoad() {
    console.log("starting");
  }

  goToLogin() {
    //判断是否第一次登录
    if(this.isLoginOnce){
      this.navCtrl.push(LoginPage);
    }else{
      this.isLoginBefore();
    }
  }

  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }

  goToSeeEachPerson() {
    this.navCtrl.push(EveryPersonPage);
  }


  //之前是否登录过
  public loginInfo = {
    account:'',
    password:''
  }

  isLoginBefore(){

    this.myStorage.getUser().then(val => {
      if(val!=null){
        this.memory.setUser(val);
        this.isLoginOnce = false;
        this.navCtrl.push(TabsPage);
      }
    })

/*    this.storage.get('account').then((val)=>{
      if(val!=null){
        console.log(val)
        this.loginInfo.account = val;
        this.storage.get('password').then((val)=>{
          if(val!=null){
            console.log(val)
            this.loginInfo.password = val;
            //获取了之前登陆过的信息
            this.myHttp.post(MyHttp.URL_LOGIN, this.loginInfo, (data) => {
              console.log(data)
              let loginResult = data.loginResult;
              if (loginResult==='2' || loginResult==='1') {
                console.log("账号密码错误")
              } else {
                console.log(data.user)
                this.memory.setUser(data.user);

                this.isLoginOnce = false;
                this.navCtrl.push(TabsPage);
              }
            })
          }else{
            console.log("val中password为空")
          }
        })
      }else{
        console.log("val中account为空")
      }
    })*/
  }

/*  loginFailError(subTitle: string) {
    this.alertCtrl.create({
      title: "登录失败",
      subTitle: subTitle,
      buttons: ["关闭"]
    }).present();
  }*/

}
