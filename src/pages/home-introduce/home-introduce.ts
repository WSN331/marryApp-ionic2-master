/**
 * Created by ASUS on 2017/8/29 0029.
 */
import { Component } from '@angular/core';
import { AlertController, NavController, NavParams} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'
import {CommunicatePage} from "../communicate/communicate";

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

  /**
   * 通过审核的证件
   * @type {Array}
     */
  public creds = [];

  /**
   * 全部图片
   * @type {Array}
     */
  public allPictures = [];

  /**
   * 是否显示弹窗
   * @type {boolean}
     */
  public display_dialog=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alert:AlertController,
              public myHttp : MyHttp, public imgService:ImgService, public memory: Memory,
              public calculateService: CalculateService, public loadingCtrl:LoadingController) {
    this.getUserInfo();
    this.getAllPicture();
    this.initCred();
  }

  /**
   * 返回
   */
  back() {
    this.navCtrl.pop();
  }

  changeDisplayDialog() {
    this.display_dialog = !this.display_dialog;
  }

  /**
   * 获取用户信息
   */
  getUserInfo(callBack?) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.memory.getUser().id,
      otherUserId: this.navParams.get('otherUserId')
    }, (data) => {
      console.log(data)
      this.baseInfo = data.baseInfo || {};
      this.detailInfo = data.detailInfo || {};
      this.relation = data.relation || {};
      this.creds = data.creds || [];
      if(data.introduceResult==='1'){
        this.pushPrompt();
      }
      if (callBack !== null && typeof callBack === 'function') {
        callBack();
      }
      loader.dismiss();
    })
  }

  /**
   * 获取全部图片
   */
  getAllPicture() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    this.myHttp.post(MyHttp.URL_GET_ALL_PICTURE, {
      userId: this.navParams.get('otherUserId'),
    }, (data) => {
      console.log(data)
      this.allPictures = data.allPicture;
      loader.dismiss();
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
   *
   * @param type 0喜欢，1讨厌，2取消喜欢，3取消讨厌，4收藏，5取消收藏
     */
  changeRelation(type: number) {
    let url = [MyHttp.URL_LIKE,MyHttp.URL_HATE,MyHttp.URL_DIS_LIKE,MyHttp.URL_DIS_HATE,MyHttp.URL_COLLECT,MyHttp.URL_DIS_COLLECT][type];
    this.myHttp.post(url, {
      userId: this.memory.getUser().id,
      toUserId: this.navParams.get('otherUserId')
    }, (data) => {
      //点击喜欢
      if(type===0){
        this.memory.setLike(true);
      }
      this.getUserInfo();
    })
  }

  /**
   * 切换到聊天界面
   */
  eachCommunicate(){
    this.navCtrl.push(CommunicatePage,{
      person:this.navParams.get('otherUserId')
    });
  }

  //验证信息
  public myCred = [];
  //需要验证的项目
  public credTypes = [];
  /**
   * 判定用户验证信息
   */
  private initCred() {
    this.myHttp.post(MyHttp.URL_CRED_INFO, {
      userId: this.navParams.get('otherUserId')
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
      if (cred.type['id'] === typeId) {
        if(cred.auditStatus===1){
          return true;
        }
      }
    }
    return false;
  }

}
