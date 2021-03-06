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
import { MyStorage } from '../../util/MyStorage'
import { ImgService } from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'
import {Constants} from '../../util/Constants'

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

  public credTitles = [];

  /**
   *
   * @type {boolean}
     */
  public noCredSuccess = true;

  public allCredSuccess = true;

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public imgService:ImgService,
              public memory:Memory, public events: Events, public calculateService: CalculateService,
              public alertCtrl: AlertController, public loadingCtrl:LoadingController, public myStorage:MyStorage) {
    this.initUserInfo();
    this.getUserInfo(null, true);
    this.initCred();
    this.events.subscribe('e-user-introduce', () => {
      this.getUserInfo(null, true);
      this.initCred();
    })
  }

  initUserInfo() {
    this.myStorage.getUserInfo(this.memory.getUser().id).then((val) =>{
      if (typeof val !== "undefined" && typeof val[Constants.STORAGE.userInfo] !== "undefined") {
        this.baseInfo = val[Constants.STORAGE.userInfo].baseInfo || {};
        this.detailInfo = val[Constants.STORAGE.userInfo].detailInfo || {};
      }
    });
  }

  ionViewDidEnter() {
    this.getUserInfo(null, true);
    this.initCred();
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
  getUserInfo(callBack?, unLoader?) {
    console.log(unLoader)
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.memory.getUser().id,
      otherUserId: this.memory.getUser().id
    }, (data) => {
      console.log(data)
      this.baseInfo = data.baseInfo || {};
      this.detailInfo = data.detailInfo || {};
      this.myStorage.getUserInfo(this.memory.getUser().id).then((val) =>{
        if (val == null) {
          val = {};
        }
        val[Constants.STORAGE.userInfo] = {
          baseInfo : this.baseInfo,
          detailInfo : this.detailInfo
        };
        this.myStorage.setUserInfo(this.memory.getUser().id, val);

        /**
         * add in 2018-03-30
         */
        this.memory.setUser(this.baseInfo)
      });
      if (callBack !== null && typeof callBack === 'function') {
        callBack();
      }
    }, null, unLoader);
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
    this.myHttp.post(MyHttp.URL_CRED_INFO_BY_TITLE, {
      userId: this.memory.getUser().id
    }, (data) => {
      //验证信息
      this.myCred = data.myCred;
      //所有需要验证的项目
      this.credTypes = data.credTypes;
      //
      this.credTitles = data.credTitles;
    }, null, true)
  }

  /**
   * 获取身份验证状态
   * @param typeId
   * @returns {any} -2 ~ 1分别表示 未认证、未通过、等待审核、审核通过
   */
  getStatus(typeId) : boolean {
    for (let cred of this.myCred) {
      if (cred.type.id == typeId && cred.auditStatus == 1) {
        return true;
      }
    }
    this.allCredSuccess = false;
    return false;
  }

  /**
   * 根据标题
   * @param titleId
   */
  getStatusByTitle (titleId) {
    for (let type of this.credTypes) {
      if (type.title['id'] === titleId) {
        let status = this.getStatus(type.id);
        if (!status) {
          return false;
        }
      }
    }
    this.noCredSuccess = false;
    return true;
  }


  /**
   * 去认证界面
   */
  goToCred(){
    this.navCtrl.push(CredListPage);
  }

  isNotNull(item) {
    return this.calculateService.isNotNull(item);
  }

  isNotZero(num) {
    return this.calculateService.isNotZero(num);
  }
}
