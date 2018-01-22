import {Component} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {HomeIntroducePage} from "../home-introduce/home-introduce";
import {MyHttp} from "../../util/MyHttp";
import {CalculateService} from "../../util/CalculateService";
import {Memory} from "../../util/Memory";

@Component({
  selector:"page-search",
  templateUrl:"search.html"
})

export class SearchPage{

/*  private userId;*/

  //基本搜索部分的信息
  public searchInfo = {};

  private strForChoose = {
    high:['165以下','165-170','170-175','175-180','180以上'],
    age:['25以下','25-30','30-35','35-40','40以上'],
    edu:['本科','硕士','博士','博士后'],
    income:['5万以下','5-10万','10-20万','20-30万','30-100万','100万以上'],
  };

  //VIP搜索部分的信息
  public selectOption = {
    provinceList: [],
    newDistrictSelect: {cityList: [], districtList: []},
    oldDistrictSelect: {cityList: [], districtList: []},
  }

  constructor(public navCtrl:NavController,public alertCtrl: AlertController,
              public myHttp:MyHttp,public calculateService: CalculateService,
              public memory:Memory){
    this.getProvinceList();
  }

  //普通搜索
  searchCom(){

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

