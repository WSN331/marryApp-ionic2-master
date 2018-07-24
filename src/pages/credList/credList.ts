/**
 * Created by ASUS on 2017/10/23 0023.
 */
import { Component } from '@angular/core';
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

  /**
   * 证件标题
   * @type {Array}
     */
  private credTitles = [];

  constructor(public navCtrl: NavController, public myHttp : MyHttp,
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
    this.myHttp.post(MyHttp.URL_CRED_INFO_BY_TITLE, {
      userId: this.memory.getUser().id
    }, (data) => {
      console.log("data")
      console.log(data)
      this.myCred = data.myCred;
      this.credTypes = data.credTypes;
      this.credTitles = data.credTitles;
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
   * 根据标题
   * @param titleId
     */
  getStatusByTitle (titleId) {
    let result = 1;
    for (let type of this.credTypes) {
      if (type.title['id'] === titleId) {
        let status = this.getStatus(type.id);
        if (status < result) {
          result = status;
        }
      }
    }
    return result;
  }

  /**
   * 点击触发
   * @param typeId
     */
  clickItem(title) {
    if (this.getStatusByTitle(title["id"]) < 0) {
      let types = [];
      let i = 0;
      for (let type of this.credTypes) {
        if (type.title['id'] === title.id) {
          types[i++] = type;
        }
      }
      this.navCtrl.push(AddCredPage, {title: title, types: types})
    }
  }



  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

}
