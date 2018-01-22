import {Component} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import { Events } from 'ionic-angular';

import {MyHttp} from "../../util/MyHttp";
import {CalculateService} from "../../util/CalculateService";
import {Memory} from "../../util/Memory";
import { Constants } from '../../util/Constants'

@Component({
  selector:"page-search",
  templateUrl:"search.html"
})

export class SearchPage{

/*  private userId;*/

  //基本搜索部分的信息
  public searchInfo = {
    high : '',
    age : '',
    income : '',
    edu : ''
  };

  private strForChoose = {
    high:Constants.SELECT.high,
    age:Constants.SELECT.age,
    income: Constants.SELECT.income,
    edu: Constants.SELECT.edu
  };

  //VIP搜索部分的信息
  public selectOption = {
    provinceList: [],
    newDistrictSelect: {cityList: [], districtList: []},
    oldDistrictSelect: {cityList: [], districtList: []},
  }

  constructor(public navCtrl:NavController,public alertCtrl: AlertController,
              public myHttp:MyHttp,public calculateService: CalculateService,
              public memory:Memory, public events: Events){
    this.getProvinceList();
  }

  //普通搜索
  searchCom(){
    this.events.publish('e-home-search', this.searchInfo);
    this.navCtrl.pop();
  }

  //Vip搜索
  searchVip(){

  }



  /**
   * 退出
   */
  back(){
    this.navCtrl.pop();
  }


  /**
   * 判断是否为空
   * @param str
   * @returns {boolean}
   */
  isStrNull(str) {
    return str == null || str == "";
  }
  /**
   * 类型选择
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
        this.searchInfo[type] = data;
      }
    })
    alert.present();
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
   * 判断当前用户是否是VIP用户
   */
  isVipOrNot():boolean{
    return this.calculateService.isVip(this.memory.getUser().vipTime)
  }

}

