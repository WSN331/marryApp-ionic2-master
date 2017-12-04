/**
 * Created by ASUS on 2017/10/23 0023.
 */
import { Component } from '@angular/core';
import {LoadingController} from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'

import { AddCredPage } from '../addCred/addCred'

@Component({
  selector: 'page-credList',
  templateUrl: 'credList.html'
})

export class CredListPage {
  /**
   * 我的证件验证情况
   * @type {Array}
     */
  private myCred = [];

  /**
   * 证件类型
   * @type {Array}
     */
  private credTypes = [];

  constructor(public navCtrl: NavController, public myHttp : MyHttp, public loadingCtrl:LoadingController,
              public memory: Memory, public events: Events) {
    this.initCred();
    this.events.subscribe('e-get-cred', () => {
      this.initCred();
    })
  }

  /**
   * 初始化身份验证的信息
   */
  initCred() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    this.myHttp.post(MyHttp.URL_CRED_INFO, {
      userId: this.memory.getUser().id
    }, (data) => {
      console.log(data)
      loader.dismiss();
      this.myCred = data.myCred;
      this.credTypes = data.credTypes;
    })
  }

  /**
   * 获取身份验证状态
   * @param typeId
   * @returns {any} -2 ~ 1分别表示 未认证、未通过、等待审核、审核通过
     */
  getStatus(typeId) : number {
    for (let cred of this.myCred) {
      if (cred.type['id'] === typeId) {
        return cred.auditStatus;
      }
    }
    return -2;
  }

  /**
   * 点击触发
   * @param typeId
     */
  clickItem(type) {
    if (this.getStatus(type["id"]) < 0) {
      this.navCtrl.push(AddCredPage, {type: type})
    }
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

}
