/**
 * Created by ASUS on 2017/8/29 0029.
 */
import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import {Memory} from "../../util/Memory";
import {ImgService} from "../../util/ImgService";
import {MyHttp} from "../../util/MyHttp";
import {CalculateService} from "../../util/CalculateService";
import {RzTwoPage} from "../rztwo/rztwo";


@Component({
  selector: 'page-rzone',
  templateUrl: 'rzone.html'
})
export class RzOnePage {

  //图片的Base64格式
  private base64;

  //用户登录Id
  private userId;

  //基本信息
  public json = {
    userId:'',
    nickName:'',
    sex:-1,
    birthday:'',
    graduation:-1,
    oldDistrict:'',
    oldDistrictCity:'',
    oldDistrictProvince:'',
  }

  /**
   * 各个复选框
   * @type {{provinceList: {}, cityList: {}, districtList: {}}}
   */
  public selectOption = {
    provinceList: [],
    oldDistrictSelect: {cityList: [], districtList: []},
  }

  //dataTime能够选择的时间
  private maxTime;

  constructor(public navCtrl: NavController, public myHttp : MyHttp, public imgService:ImgService,
              public memory: Memory, public events: Events, public navParams: NavParams,
              public alertCtrl: AlertController,public calculateService: CalculateService) {
    this.getUserId();
    this.getProvinceList();
    this.maxTime = this.calculateService.getMaxTimeChooser();
  }

  //确认信息上传
  save(){
    this.json.userId = this.userId
    this.json.oldDistrict = this.selectOption['oldDistrictSelect']["id"]
    this.json.oldDistrictCity = this.selectOption['oldDistrictSelect']["cityId"];
    this.json.oldDistrictProvince = this.selectOption['oldDistrictSelect']["provinceId"];
    for(let name in this.json){
      //判断里面所有选项不为空
    }
    //还有一个照片

    this.navCtrl.push(RzTwoPage)
  }

  //获取登录用户的id
  getUserId() {
    this.userId = this.navParams.get("userId") || this.memory.getUser().id;
    console.log(this.userId)
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
   * 添加图片
   */
  addPicture() {
    this.imgService.chooseCamera((imageData) => {
      this.base64 = imageData
    })
  }

  /**
   * 是否有图片存在
   * @returns {boolean}
   */
  havePic() {
    return this.base64 != null && this.base64 != undefined;
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }
}
