import { Component } from '@angular/core';
import { App, NavController, AlertController} from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { AppUpdate } from '@ionic-native/app-update';

import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'
import { CalculateService } from '../../util/CalculateService'
import { MyHttp } from '../../util/MyHttp';
import { MyStorage } from '../../util/MyStorage';

import { StartPage } from '../start/start'
import { BlackPage } from '../black/black'
import { UserIntroducePage } from '../user-introduce/user-introduce'
import { CredListPage } from '../credList/credList'
import { PayPage } from "../purchase/pay";
import { AuthorInformationPage } from "../authorInformation/authorInformation"
import {SafePage} from "../safe/safe";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage{

  public user;

  versionNumber = '1.0';

  isLatestVersion = true;

  appType = "android";

  constructor(public navCtrl: NavController, public imgService: ImgService, public memory: Memory,
              public app:App, public events: Events, public calculateService: CalculateService,
              public myStorage:MyStorage, private appVersion: AppVersion, private myHttp : MyHttp,
              public alertCtrl: AlertController, private appUpdate : AppUpdate) {
    this.getUser();
    this.events.subscribe('e-user-self', () => {
      this.getUser();
    });
    //noinspection TypeScriptUnresolvedFunction
    this.appVersion.getVersionNumber().then(versionNumber => {
      this.versionNumber = versionNumber;
      this.getLatestVersion();
    }).catch(error => {
      alert(error);
    })
  }

  /**
   * 获取最新版本
   */
  getLatestVersion() {
    this.myHttp.post(MyHttp.URL_GET_LATEST_APP_VERSION, {}, (data) => {
      let appVersion = data.app_version;
      if (appVersion != null) {
        this.isLatestVersion = this.versionNumber == appVersion;
      }
    })
  }

  /**
   * 获取最新的appURL
   */
  getAppDownLoadUrl() {
    if (!this.isLatestVersion) {
      this.alertCtrl.create({
        title: "下载最新版",
        subTitle: "是否下载最新版本",
        buttons: [{
          text: '确定',
          handler: data => {
            this.appUpdate.checkAppUpdate(MyHttp.URL_GET_APP_DOWNLOAD_URL).catch(error => {
              console.log(JSON.stringify(error));
            });
          }
        },"关闭"]
      }).present();
    }

  }

  /**
   * 下载app
   * @param url
     */
  downLoadApp(url : string) {
    this.alertCtrl.create({
      title : "下载地址",
      subTitle: url,
      buttons: ["关闭"]
    }).present();
  }

  /**
   * 获取用户信息
   */
  getUser() {
    this.user = this.memory.getUser();
  }

  /**
   * 获取详细信息
   */
  getIntroduce() {
    this.navCtrl.push(UserIntroducePage);
  }

  /**
   * 进入信息认证详情界面
   */
  goToCredList() {
    this.navCtrl.push(CredListPage);
  }

  /**
   * 进入黑名单
   */
  goToBlack() {
    this.navCtrl.push(BlackPage);
  }

  /**
   * 进入黑名单
   */
  goToSafe() {
    this.navCtrl.push(SafePage);
  }

  /**
   * 登出
   */
  logout() {
    this.alertCtrl.create({
      title: "退出登录",
      subTitle: "确定退出？",
      buttons: [{
        text: '确定',
        handler: data => {
          this.myStorage.setAccount(null);
          this.myStorage.setPassword(null);
          this.app.getRootNav().setRoot(StartPage);
          this.myStorage.setUser(null);
          this.memory.setUser({});
        }
      },"关闭"]
    }).present();

  }

  /**
   * 成为会员
   */
  toPay(){
    this.navCtrl.push(PayPage);
  }

  authorInformation() {
    this.navCtrl.push(AuthorInformationPage);
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }
}
