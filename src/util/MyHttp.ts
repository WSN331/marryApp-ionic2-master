/**
 * Created by ASUS on 2017/8/29 0029.
 */
import {Injectable} from '@angular/core';
import {Http, RequestOptionsArgs, Headers} from '@angular/http';
import {LoadingController} from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MyHttp {
  /**
   * 服务器的IP
   * @type {string}
   */
  // static IP = "47.95.212.171";
  static IP = "localhost"
  // static IP = "192.168.2.178"

  /**
   * 服务端端口号
   * @type {number}
   */
  static PORT = 8080;

  /**
   * 服务端的接口名
   * @type {string}
   */
  static SERVER_NAME = "MarryApp/phone";

  /**
   * 请求的url
   * @type {string}
     */
  // 登录
  static URL_LOGIN = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/login";
  // 注册
  static URL_REGISTER = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/register";
  // 完善个人信息
  static URL_USER_COMPLETE = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/complete";
  // 用户列表
  static URL_USER_LIST = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/list";
  // 用户详情
  static URL_USER_INTRODUCE = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/introduce";
  // 获取全部图片
  static URL_GET_ALL_PICTURE = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/getAllPicture";
  // 喜欢的列表
  static URL_LIKE_LIST = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/likeList";
  // 被喜欢的列表
  static URL_BE_LIKE_LIST = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/beLikeList";
  // 收藏的列表
  static URL_COLLECT_LIST = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/collectList";
  // 喜欢
  static URL_LIKE = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/like";
  // 取消喜欢
  static URL_DIS_LIKE = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/disLike";
  // 讨厌
  static URL_HATE = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/hate";
  // 取消讨厌
  static URL_DIS_HATE = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/disHate";
  // 收藏
  static URL_COLLECT = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/collect";
  // 取消收藏
  static URL_DIS_COLLECT = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/disCollect";
  // 获取省份列表
  static URL_GET_PROVINCE_LIST = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/select/getProvinceList";
  // 获取城市列表
  static URL_GET_CITY_LIST = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/select/getCityList";
  // 获取地区列表
  static URL_GET_DISTRICT_LIST = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/select/getDistrictList";
  // 获取学校列表
  static URL_GET_SCHOOL_LIST = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/select/getSchoolList";
  // 添加学校
  static URL_ADD_SCHOOL = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/select/addSchool";
  // 获取证件信息
  static URL_CRED_INFO = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/credInfo";
  // 添加证件
  static URL_ADD_CRED = "http://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/addCred";

  constructor (private http : Http, public loadingCtrl:LoadingController) {

  }


  /**
   * 生成post请求的body
   * @param json json格式的参数
   * @returns {string} 返回成=&形式的body
     */
  body (json : JSON) : string {
    let body : string = '';
    for (let i in json) {
      body = body + i + '=' + json[i] + '&'
    }
    return body;
  }

  /**
   * 请求的URL
   * @param url 请求URL
   * @param success 成功的回调函数
   * @param options 请求其他值设置
     */
  get (url: string, success : Function, options?: RequestOptionsArgs){
    this.http.get(url, options).subscribe((data) => {
      this.callBack(success, data);
    });
  }

  /**
   * post请求的封装
   * @param url 请求的URL
   * @param body 请求体
   * @param success 成功的回调函数
   * @param options 请求其他值设置
     */
  post (url: string, body: any, success : Function, options?: RequestOptionsArgs) {
    if (options == null ) {
      options = {headers: new Headers()}
    }
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.http.post(url, this.body(body), options).subscribe((data) => {
      console.log(data)
      loader.dismiss();
      this.callBack(success, data);
    });
  }

  /**
   * 处理请求返回
   * @param success 成功的回调函数
   * @param data 数据
     */
  callBack (success: Function, data: any) {
    if (data.status !== 200) {
      console.log('net error')
      console.log(data)
    } else {
      let body = JSON.parse(data._body);
      if (body === null || body === undefined) {
        return;
      }
      if (body.result === 'error') {
        console.log("back error")
        console.log(body)
      } else {
        success(body);
      }
    }
  }


}
