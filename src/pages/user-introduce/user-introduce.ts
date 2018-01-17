/**
 * Created by ASUS on 2017/9/4 0004.
 */
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {LoadingController} from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'

import { UserDetailPage } from '../user-detail/user-detail'
import { AboutPage } from "../about/about"
import { ControlImagePage } from "../control-image/control-image"
import {PayPage} from "../purchase/pay";
import {CredListPage} from "../credList/credList";
import {LargeImagePage} from "../large-image/large-image";

@Component({
  selector: 'page-userIntroduce',
  templateUrl: 'user-introduce.html'
})

export class UserIntroducePage {
  /**
   * 基本信息
   */
  public baseInfo = {};

  /**
   * 详细信息
   */
  public detailInfo = {}

  /**
   * 验证信息
   * @type {Array}
     */
  public myCred = [];
  /**
   * 需要验证的项目
   */
  public credTypes = [];

  /**
   *
   * @type {number}
     */
  public noCredSuccess = true;

  public allCredSuccess = true;

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public imgService:ImgService,
              public memory:Memory, public events: Events, public calculateService: CalculateService,
              public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
    this.getUserInfo();
    this.initCred();
    this.events.subscribe('e-user-introduce', () => {
      this.getUserInfo();
      this.initCred();
    })
  }

  /**
   * 查看大图
   * @param base64
   */
  toLargeImage(base64) {
    this.navCtrl.push(LargeImagePage, {
      imageBase64 : base64
    });
  }

  //设置界面
  goToSetting() {
    this.navCtrl.push(AboutPage);
  }
  //去到图片管理界面
  gotToControlImage() {
    this.navCtrl.push(ControlImagePage);
  }
  //开通Vip界面
  goToOpenVip(){
    this.navCtrl.push(PayPage);
  }


  /**
   * 获取用户信息
   * @param callBack 可能存在的回调
   */
  getUserInfo(callBack?) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.memory.getUser().id,
      otherUserId: this.memory.getUser().id
    }, (data) => {
      console.log(data)
      this.baseInfo = data.baseInfo || {};
      this.detailInfo = data.detailInfo || {};
      loader.dismiss();
      if (callBack !== null && typeof callBack === 'function') {
        callBack();
      }
    })
  }

  /**
   * 跳转到完善信息界面
   */
  detail() {
    this.navCtrl.push(UserDetailPage);
  }

  /**
   * 判定用户验证信息
   */
  private initCred() {
    this.myHttp.post(MyHttp.URL_CRED_INFO, {
      userId: this.memory.getUser().id
    }, (data) => {
      //验证信息
      this.myCred = data.myCred;
      //所有需要验证的项目
      this.credTypes = data.credTypes;
    })
  }

  /**
   * 获取身份验证状态
   * @param typeId
   * @returns {any} -2 ~ 1分别表示 未认证、未通过、等待审核、审核通过
   */
  getStatus(typeId) : boolean {
    for (let cred of this.myCred) {
      if (cred.type.id == typeId && cred.auditStatus == 1) {
        this.noCredSuccess = false;
        return true;
      }
    }
    this.allCredSuccess = false;
    return false;
  }


  /**
   * 去认证界面
   */
  goToCred(){
    this.navCtrl.push(CredListPage);
  }
}
