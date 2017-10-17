/**
 * Created by ASUS on 2017/9/4 0004.
 */
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SafeUrl } from '@angular/platform-browser';
import { Events } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'

import { UserDetailPage } from '../user-detail/user-detail'

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

  constructor(public navCtrl:NavController, private myHttp:MyHttp, private imgService:ImgService,
              public memory:Memory, public events: Events, public calculateService: CalculateService) {
    this.getUserInfo();
    this.events.subscribe('e-user-introduce', () => {
      this.getUserInfo();
    })
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.memory.getUser().id,
      otherUserId: this.memory.getUser().id
    }, (data) => {
      console.log(data)
      this.baseInfo = data.baseInfo || {};
      this.detailInfo = data.detailInfo || {};
    })
  }

  /**
   * 修改安全URL图片
   * @param image
   */
  sageImage(image: String) : SafeUrl{
    return this.imgService.safeImage(image)
  }

  /**
   * 修改图片
   */
  changeImage() {
    this.imgService.chooseCamera((imageData) => {
      this.myHttp.post(MyHttp.URL_USER_COMPLETE, {
        picture: imageData,
        userId: this.memory.getUser().id
      }, (data)=>{
        this.getUserInfo();
        // this.memory.getSex()
      })
    })
  }

  /**
   * 跳转到完善信息界面
   */
  detail() {
    this.navCtrl.push(UserDetailPage);
  }

}
