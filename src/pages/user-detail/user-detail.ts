/**
 * Created by ASUS on 2017/9/4 0004.
 */
import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { UserDetail2Page } from "../user-detail2/user-detail2"

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'

@Component({
  selector: 'page-userDetail',
  templateUrl: 'user-detail.html'
})

export class UserDetailPage {
  /**
   * 基本信息
   */
  public baseInfo = {}

  /**
   * 详细信息
   */
  public detailInfo = {}

  /**
   *
   * @type {number}
     */
  private userId;

  /**
   * 待填写的字符串
   * @type {{income: string[], hopeTime: string[], edu: string[]}}
     */
  private strForChoose = {
    income: ['5万以下','5-10万','10-20万','20-30万','30-100万','100万以上'],
    hopeTime: ['半年内','一年内','1-3年内','3年以上'],
    edu: ['初中及以下','高中','大学','研究生及以上']
  };

  constructor(public navCtrl:NavController,public navParams:NavParams, private myHttp:MyHttp, public memory:Memory,
              public events: Events, public alertCtrl: AlertController) {
    this.getUserId();
    this.getUserInfo();
  }

  getUserId() {
    this.userId = this.navParams.get("userId")||this.memory.getUser().id;
    //this.userId="1";
  }

  /**
   * 获取用户信息
   * @param callBack 可能存在的回调
     */
  getUserInfo(callBack?) {
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.userId,
      otherUserId: this.userId
    }, (data) => {
      this.baseInfo = data.baseInfo || {};
      this.detailInfo = data.detailInfo || {};
      if (callBack !== null && typeof callBack === 'function') {
        callBack();
      }
    })
  }

  /**
   * 下一步
   */
  nextStep() {
    console.log(this.baseInfo)
    this.navCtrl.push(UserDetail2Page, {
      userId : this.userId,
      baseInfo: this.baseInfo,
      detailInfo: this.detailInfo
    })
  }

  /**
   * 选择性别
     */
  chooseSex() {
    let alert = this.alertCtrl.create();
    alert.setTitle("您的性别是");
    alert.addInput({
      type : 'radio',
      label: '男',
      value: '0',
    });
    alert.addInput({
      type : 'radio',
      label: '女',
      value: '1',
    });
    alert.addButton("关闭");
    alert.addButton({
      text: '确定',
      handler: data => {
        this.baseInfo['sex'] = data;
      }
    })
    alert.present();
  }

  /**
   * 弹出选择文字的弹框
   * @param type
     */
  chooseStr(type) {
    let alert = this.alertCtrl.create();
    alert.setTitle("请选择");
    for(let i in this.strForChoose[type]) {
      let str = this.strForChoose[type][i];
      alert.addInput({
        type : 'radio',
        label: str,
        value: str,
      })
    }
    alert.addButton("关闭");
    alert.addButton({
      text: '确定',
      handler: data => {
        this.detailInfo[type] = data;
      }
    })
    alert.present();
  }

  isStrNull(str) {
    return str == null || str == "";
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

}
