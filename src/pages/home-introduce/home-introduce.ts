/**
 * Created by ASUS on 2017/8/29 0029.
 */
import { Component } from '@angular/core';
import {Alert, AlertController, NavController, NavParams} from 'ionic-angular';
import { SafeUrl } from '@angular/platform-browser';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'

@Component({
  selector: 'page-homeIntroduce',
  templateUrl: 'home-introduce.html'
})

export class HomeIntroducePage {

  /**
   * 基本信息
   */
  public baseInfo = {};

  /**
   * 详细信息
   */
  public detailInfo = {}

  /**
   * 关系
   * @type {string}
     */
  public relation = "0"

  constructor(public navCtrl: NavController, public navParams: NavParams,public alert:AlertController,
              private myHttp : MyHttp, private imgService:ImgService, public memory: Memory) {
    this.getUserInfo();
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.memory.getUser().id,
      otherUserId: this.navParams.get('otherUserId')
    }, (data) => {
      console.log(data)
      this.baseInfo = data.baseInfo || {};
      this.detailInfo = data.detailInfo || {};
      this.relation = data.relation || {};
      if(data.introduceResult==='1'){
        this.pushPrompt();
      }
    })
  }

  /**
   * 没有查询到用户的弹出框
   */
  pushPrompt() {
    this.alert.create({
      message:'查无此人，请确认后查询',
      buttons:[{
        text:'OK',
        handler:()=>{
          this.navCtrl.pop();
      }
      }]
    }).present();
  }

  /**
   * 修改图片
   * @param image
   */
  changeImage(image: String) : SafeUrl{
    return this.imgService.safeImage(image)
  }

  /**
   *
   * @param type
     */
  changeRelation(type: number) {
    let url = [MyHttp.URL_LIKE,MyHttp.URL_HATE,MyHttp.URL_DIS_LIKE,MyHttp.URL_DIS_HATE][type];
    this.myHttp.post(url, {
      userId: this.memory.getUser().id,
      toUserId: this.navParams.get('otherUserId')
    }, (data) => {
      this.getUserInfo();
    })
  }



}
