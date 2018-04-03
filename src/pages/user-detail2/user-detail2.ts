/**
 * Created by ASUS on 2017/9/4 0004.
 */
import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Events} from 'ionic-angular';
import {AlertController} from 'ionic-angular';


import {MyStorage} from "../../util/MyStorage";
import {MyHttp} from '../../util/MyHttp';
import {Memory} from '../../util/Memory'

@Component({
  selector: 'page-userDetail2',
  templateUrl: 'user-detail2.html'
})

export class UserDetail2Page {
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
    provinceList: [],
    newDistrictSelect: {cityList: [], districtList: []},
    oldDistrictSelect: {cityList: [], districtList: []},
    firstSchoolSelect: {cityList: [], districtList: []},
    secondSchoolSelect: {cityList: [], districtList: []},
    thirdSchoolSelect: {schoolList: []},
    forthSchoolSelect: {schoolList: []},
  }


  /**
   * 等级划分
   * @type {{firstSchoolSelect: number, secondSchoolSelect: number, thirdSchoolSelect: number, forthSchoolSelect: number}}
   */
  private scales = {firstSchoolSelect: 1, secondSchoolSelect: 2, thirdSchoolSelect: 3, forthSchoolSelect: 4};

  /**
   * 需要复选的内容
   * @type {string}
   */
  private detailInfoSelect = "newDistrict oldDistrict firstSchool secondSchool thirdSchool forthSchool";

  /**
   *
   * @type {number}
   */
  private userId;

  constructor(public navCtrl:NavController, public navParams:NavParams, private myHttp:MyHttp, public memory:Memory,
              public events:Events, public alertCtrl:AlertController,public myStorage:MyStorage) {
    this.getUserInfo();
    this.getProvinceList();

  }

  /**
   * 获取用户信息
   * @param callBack 可能存在的回调
   */
  getUserInfo(callBack?) {
    this.userId = this.navParams.get('userId');
    this.baseInfo = this.navParams.get('baseInfo');
    this.detailInfo = this.navParams.get('detailInfo');

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
        this.getCityList(name + 'Select');
        this.selectOption[name + 'Select'].cityId = this.detailInfo[name].city.id;
        this.getDistrictList(name + 'Select');
      } else {
        // 初始化选中的学校列表
        this.selectOption[name + 'Select'].provinceId = this.detailInfo[name].province.id;
        this.getSchoolList(name + 'Select');
      }
      this.selectOption[name + 'Select'].id = this.detailInfo[name].id;
    }
    console.log(this.selectOption);

    if (callBack !== null && typeof callBack === 'function') {
      callBack();
    }

  }

  /**
   * 完善个人信息
   */
  detail() {
    console.log("json数据展示")
    let json = {
      userId: this.baseInfo['id']
    };
    for (let name in this.baseInfo) {
      if (name !== "picture") {
        json[name] = this.baseInfo[name];
      }
    }
    for (let name in this.detailInfo) {
      if (this.detailInfoSelect.indexOf(name) == -1) {
        json[name] = this.detailInfo[name];
      } else {
        json[name] = this.selectOption[name + 'Select'].id
      }
    }

    console.log(json)
    console.log("json数据展示")

    this.myHttp.post(MyHttp.URL_USER_COMPLETE, json, (data)=> {
      this.getUserInfo(() => {

        this.myStorage.setUser(this.baseInfo);
        this.memory.setUser(this.baseInfo);

        this.events.publish("e-user-self");
        this.events.publish('e-user-introduce');
        this.events.publish('e-home-list');
      });
      this.navCtrl.pop();
      this.navCtrl.pop();
      this.navCtrl.pop();
    })
  }

  /**
   * 获取省份列表
   */
  getProvinceList() {
    this.myHttp.post(MyHttp.URL_GET_PROVINCE_LIST, {}, (data)=> {
      console.log(data);
      this.selectOption.provinceList = data.list;
      console.log(this.selectOption);
    });
  }

  /**
   * 获取城市列表
   * @param selectName 选择参数名
   */
  getCityList(selectName:string) {
    this.selectOption[selectName].id = null;
    this.selectOption[selectName].districtList = [];
    this.myHttp.post(MyHttp.URL_GET_CITY_LIST, {
      provinceId: this.selectOption[selectName].provinceId
    }, (data)=> {
      console.log(data);
      this.selectOption[selectName].cityList = data.list;
    });
  }

  /**
   * 获取学校列表
   * @param selectName 选择参数名
   */
  getSchoolList(selectName:string) {
    this.myHttp.post(MyHttp.URL_GET_SCHOOL_LIST, {
      provinceId: this.selectOption[selectName].provinceId,
      scale: this.scales[selectName]
    }, (data)=> {
      console.log(data);
      this.selectOption[selectName].schoolList = data.list;
    });
  }

  /**
   * 获取地区列表
   * @param selectName 选择参数名
   */
  getDistrictList(selectName:string) {
    this.myHttp.post(MyHttp.URL_GET_DISTRICT_LIST, {
      cityId: this.selectOption[selectName].cityId
    }, (data)=> {
      console.log(data);
      this.selectOption[selectName].districtList = data.list;
    });
  }

  /**
   * 跳出添加学校第一步弹窗
   */
  public alertAddSchoolStep1() {
    let alert = this.alertCtrl.create();
    alert.setTitle("选择省份");
    for (let province of this.selectOption.provinceList) {
      alert.addInput({
        type: 'radio',
        label: province['name'],
        value: province['id'],
      });
    }
    alert.addButton("关闭");
    alert.addButton({
      text: '下一步',
      handler: data => {
        this.alertAddSchoolStep2(data);
      }
    })
    alert.present();
  }

  /**
   * 跳出添加学校第二步弹窗
   * @param provinceId 省份
   */
  private alertAddSchoolStep2(provinceId) {
    let alert = this.alertCtrl.create();
    alert.setTitle("选择学校类型");
    alert.addInput({
      type: 'radio',
      label: '小学',
      value: '1',
    });
    alert.addInput({
      type: 'radio',
      label: '初中',
      value: '2',
    });
    alert.addInput({
      type: 'radio',
      label: '高中',
      value: '3',
    });
    alert.addInput({
      type: 'radio',
      label: '大学',
      value: '4',
    });
    alert.addButton("关闭");
    alert.addButton({
      text: '下一步',
      handler: data => {
        this.alertAddSchoolStep3(provinceId, data);
      }
    })
    alert.present();
  }

  /**
   * 添加学校的第三步
   * @param provinceId 省份
   * @param scale 学校类型
   */
  private alertAddSchoolStep3(provinceId, scale) {
    this.alertCtrl.create({
      title: '填写学校名',
      inputs: [{
        name: 'name',
        placeholder: '学校全名'
      }],
      buttons: [{
        text: "提交",
        handler: data => {
          this.addSchool(provinceId, scale, data.name);
        }
      }]
    }).present();
  }

  /**
   * 执行添加学校
   */
  private addSchool(provinceId, scale, name) {
    console.log(provinceId)
    console.log(scale)
    console.log(name)
    this.myHttp.post(MyHttp.URL_ADD_SCHOOL, {
      provinceId: provinceId,
      scale: scale,
      name: name
    }, (data)=> {
      console.log(data);
      let message = '';
      if (data.addSchoolResult === '0') {
        message = '添加成功，待审核通过即可使用';
      } else if (data.addSchoolResult === '1') {
        message = '学校已存在';
      }
      this.alertCtrl.create({
        title: '结果',
        subTitle: message,
        buttons: ['关闭']
      }).present();
    });
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }
}
