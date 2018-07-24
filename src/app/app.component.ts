import {Component, ViewChild} from '@angular/core';
import {IonicApp, Keyboard, Nav, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {StartPage} from "../pages/start/start";
import {TabsPage} from "../pages/tabs/tabs";
import {AddCredPage} from "../pages/addCred/addCred";
import {LoginPage} from "../pages/login/login";
import {RzOnePage} from "../pages/rzone/rzone";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = StartPage;

  backButtonPressed: boolean = false;  //用于判断返回键是否触发
  @ViewChild('myNav') nav: Nav;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public toastCtrl: ToastController, public keyBoard: Keyboard ,
              public ionicApp: IonicApp) {
    /*this.showExit();*/

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.registerBackButtonAction();//注册返回按键事件
    });
  }

  //返回按键处理
  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      if (this.keyBoard.isOpen()) {
        this.keyBoard.close();
      }
      else {
        let activeVC = this.nav.getActive();
        let page = activeVC.instance;
        //此处if是rootPage为登录页的情况，else是rootPage为TabsPage（如果不需要判断登录页的情况直接用else内的代码即可）
        if (!(page instanceof TabsPage)) {
          if (!this.nav.canGoBack()) {
            console.log("检测到在根视图点击了返回按钮");
            this.showExit();
          }
          else {
            console.log("检测到在子路径中点击了返回按钮。");
            this.nav.pop();
          }
        }
        else {
          let tabs = page.tabs;
          let activeNav = tabs.getSelected();
          if (!activeNav.canGoBack()) {
            console.log('检测到在 tab 页面的顶层点击了返回按钮。');
            this.showExit();
          }
          else {
            console.log('检测到当前 tab 弹出层的情况下点击了返回按钮。');
            activeNav.pop();
          }
        }
      }
    }, 1);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: "再按一次退出应用",
        duration: 2000,
        position: 'top',
        cssClass: 'toastcss' //修改样式（根据需要添加）
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }

  /*  //返回按键处理
    registerBackButtonAction() {
      this.platform.registerBackButtonAction(() => {
        if (this.keyBoard.isOpen()) {
          this.keyBoard.close();
        }
        else {
          let activeVC = this.nav.getActive();
          let page = activeVC.instance;
          //此处if是rootPage为登录页的情况，else是rootPage为TabsPage（如果不需要判断登录页的情况直接用else内的代码即可）
          if (!(page instanceof TabsPage)) {
            if (!this.nav.canGoBack()) {
              console.log("检测到在根视图点击了返回按钮");
              this.showExit();
            }
            else {
              console.log("检测到在子路径中点击了返回按钮。");
              this.nav.pop();
            }
          }
          else {
            let tabs = page.tabs;
            let activeNav = tabs.getSelected();
            if (!activeNav.canGoBack()) {
              console.log('检测到在 tab 页面的顶层点击了返回按钮。');
              this.showExit();
            }
            else {
              console.log('检测到当前 tab 弹出层的情况下点击了返回按钮。');
              activeNav.pop();
            }
          }
        }
      }, 1);
    }

    //双击退出提示框
    showExit() {
      if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
        this.platform.exitApp();
      } else {
        this.toastCtrl.create({
          message: "再按一次退出应用",
          duration: 2000,
          position: 'bottom'
          //cssClass: 'toastcss' //修改样式（根据需要添加）
        }).present();
        this.backButtonPressed = true;
        setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
      }
    }*/

}
