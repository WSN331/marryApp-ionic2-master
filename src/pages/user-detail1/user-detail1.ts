/**
 * Created by ASUS on 2017/9/4 0004.
 */
import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { UserDetail2Page } from "../user-detail2/user-detail2"

import { Memory } from '../../util/Memory'
import { Constants } from '../../util/Constants'

@Component({
  selector: 'page-userDetail1',
  templateUrl: 'user-detail1.html'
})

export class UserDetail1Page {
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

  constructor(public navCtrl:NavController,public navParams:NavParams, public memory:Memory,
              public events: Events, public alertCtrl: AlertController) {
    this.getUserInfo();
  }

  /**
   * 获取用户信息
   * @param callBack 可能存在的回调
     */
  getUserInfo(callBack?) {
    this.userId = this.navParams.get('userId');
    this.baseInfo = this.navParams.get('baseInfo');
    this.detailInfo = this.navParams.get('detailInfo');
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
