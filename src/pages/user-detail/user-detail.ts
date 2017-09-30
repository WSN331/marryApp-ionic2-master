/**
 * Created by ASUS on 2017/9/4 0004.
 */
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

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
   * 各个复选框
   * @type {{provinceList: {}, cityList: {}, districtList: {}}}
     */
  public selectOption = {
    provinceList : [],
    newDistrictSelect : {cityList: [], districtList: []},
    oldDistrictSelect : {cityList: [], districtList: []},
    firstSchoolSelect : {cityList: [], districtList: []},
    secondSchoolSelect : {cityList: [], districtList: []},
    thirdSchoolSelect : {schoolList: []},
    forthSchoolSelect : {schoolList: []},
  }

  /**
   * 需要复选的内容
   * @type {string}
     */
  private detailInfoSelect = "newDistrict oldDistrict firstSchool secondSchool thirdSchool forthSchool";

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public memory:Memory, public events: Events) {
    this.getUserInfo();
    this.getProvinceList();
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.memory.getUser().id,
      otherUserId: this.memory.getUser().id
    }, (data) => {
      this.baseInfo = data.baseInfo || {};
      this.detailInfo = data.detailInfo || {};
      let detailInfoSelects = this.detailInfoSelect.split(" ");
      // 遍历所有的select选项
      for (let i in detailInfoSelects) {
        let name = detailInfoSelects[i]
        if (typeof this.detailInfo[name] === 'undefined' || this.detailInfo[name] == null) {
          continue;
        }
        if (name.indexOf("District") != -1) {
          // 初始化选中的地区和地区列表
          this.selectOption[name + 'Select'].provinceId = this.detailInfo[name].city.province.id;
          this.getCityList(name+'Select');
          this.selectOption[name + 'Select'].cityId = this.detailInfo[name].city.id;
          this.getDistrictList(name+'Select');
        } else {
          // 初始化选中的学校列表
          this.selectOption[name+'Select'].provinceId = this.detailInfo[name].province.id;
          this.getSchoolList(name+'Select');
        }
        this.selectOption[name + 'Select'].id = this.detailInfo[name].id;
      }
      console.log(this.selectOption);
    })
  }

  /**
   * 完善个人信息
   */
  detail() {
    let json = {userId: this.baseInfo['id']};
    for (let name in this.baseInfo) {
      if (name!=="picture"){
        json[name] = this.baseInfo[name];
      }
    }
    for (let name in this.detailInfo) {
      if (this.detailInfoSelect.indexOf(name)==-1) {
        json[name] = this.detailInfo[name];
      } else {
        json[name]=this.selectOption[name+'Select'].id
      }
    }
    this.myHttp.post(MyHttp.URL_USER_COMPLETE, json, (data)=> {
      this.getUserInfo();
      this.navCtrl.pop();
      this.events.publish('e-user-introduce');
      this.events.publish('e-home-list');
    })
  }

  /**
   * 获取省份列表
   */
  getProvinceList() {
    this.myHttp.post(MyHttp.URL_GET_PROVINCE_LIST, {}, (data)=>{
      console.log(data);
      this.selectOption.provinceList=data.list;
      console.log(this.selectOption);
    });
  }

  /**
   * 获取城市列表
   * @param selectName 选择参数名
     */
  getCityList(selectName:string) {
    this.selectOption[selectName].id=null;
    this.selectOption[selectName].districtList=[];
    this.myHttp.post(MyHttp.URL_GET_CITY_LIST, {
      provinceId: this.selectOption[selectName].provinceId
    }, (data)=>{
      console.log(data);
      this.selectOption[selectName].cityList=data.list;
    });
  }

  /**
   * 获取学校列表
   * @param selectName 选择参数名
   */
  getSchoolList(selectName:string) {
    this.myHttp.post(MyHttp.URL_GET_SCHOOL_LIST, {
      provinceId: this.selectOption[selectName].provinceId
    }, (data)=>{
      console.log(data);
      this.selectOption[selectName].schoolList=data.list;
    });
  }

  /**
   * 获取地区列表
   * @param selectName 选择参数名
   */
  getDistrictList(selectName:string) {
    this.myHttp.post(MyHttp.URL_GET_DISTRICT_LIST, {
      cityId: this.selectOption[selectName].cityId
    }, (data)=>{
      console.log(data);
      this.selectOption[selectName].districtList=data.list;
    });
  }
}
