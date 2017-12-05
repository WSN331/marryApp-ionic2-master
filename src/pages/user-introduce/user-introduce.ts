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

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public imgService:ImgService,
              public memory:Memory, public events: Events, public calculateService: CalculateService,
              public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
    this.getUserInfo();
    this.events.subscribe('e-user-introduce', () => {
      this.getUserInfo();
    })
  }

  goToSetting() {
    this.navCtrl.push(AboutPage);
  }

  gotToControlImage() {
    this.navCtrl.push(ControlImagePage);
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

}
