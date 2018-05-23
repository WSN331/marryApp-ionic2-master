/**
 * Created by ASUS on 2017/9/4 0004.
 */
import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { UserDetail1Page } from "../user-detail1/user-detail1"

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { Constants } from '../../util/Constants'
import { CalculateService } from '../../util/CalculateService'

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
    income: Constants.SELECT.income,
    hopeTime: Constants.SELECT.hopeTime,
    edu: Constants.SELECT.edu
  };

  constructor(public navCtrl:NavController,public navParams:NavParams, private myHttp:MyHttp, public memory:Memory,
              public events: Events, public alertCtrl: AlertController, public calculateService: CalculateService) {
    this.getUserId();
    this.getUserInfo();
  }

  getUserId() {
    this.userId = this.navParams.get("userId")||this.memory.getUser().id;
    //this.userId="1";
    console.log(this.userId)
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
      console.log(data)
      this.baseInfo = data.baseInfo || {};
      this.detailInfo = data.detailInfo || {};
      if (this.detailInfo['height'] == 0) {
        this.detailInfo['height'] = null
      }
      if (this.detailInfo['weight'] == 0) {
        this.detailInfo['weight'] = null
      }
      if (!this.calculateService.isNotNull(this.baseInfo['birthday'])) {
        this.baseInfo['birthday'] = '1995-01-01'
      }
      if (callBack !== null && typeof callBack === 'function') {
        callBack();
      }
    })
  }

  isInteger(obj) {
    console.log(obj)
    return Math.floor(obj) == obj
  }

  /**
   * 下一步
   */
  nextStep() {
    console.log(this.baseInfo)
    console.log(this.detailInfo)
    if (this.isInteger(this.detailInfo["height"]) && this.isInteger(this.detailInfo["weight"])) {
      this.navCtrl.push(UserDetail1Page, {
        userId : this.userId,
        baseInfo: this.baseInfo,
        detailInfo: this.detailInfo
      })
    } else {
      this.alertCtrl.create({
        title: "信息错误",
        subTitle: "身高体重输个整数就行啦，我们不要求那么精确哦！！！",
        buttons: ["关闭"]
      }).present();
    }

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
