/**
 * Created by ASUS on 2017/8/29 0029.
 */
import {Injectable} from '@angular/core';
import {Http, RequestOptionsArgs, Headers} from '@angular/http';
import {MyStorage} from "../util/MyStorage"
import {Memory} from "../util/Memory"
import {LoadingController} from 'ionic-angular';
import { App, AlertController } from 'ionic-angular';
import { StartPage } from '../pages/start/start'

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MyHttp {
  /**
   * 服务器的IP
   * @type {string}
   */
  static IP = "api.xiehouapp.com"
  // static IP = "localhost"
  // static IP = "192.168.2.232"

  /**s
   * 服务端端口号
   * @type {number}
   */
  static PORT = 443;

  /**
   *
   * @type {string}
     */
  static PROTOCOL = "https";

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
  static URL_LOGIN = MyHttp.PROTOCOL + "://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/login";
  // 注册
  static URL_REGISTER = MyHttp.PROTOCOL + "://" + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/register";
  // 注册
  static URL_REGISTER_NO_INVITATION_CODE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/registerNoInvitaCodeStr";
  // 完善个人信息
  static URL_USER_COMPLETE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/complete";
  // 获取证件信息旧接口
  static URL_CRED_INFO = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/credInfo";
  // 获取证件信息第二版接口
  static URL_CRED_INFO_BY_TITLE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/credInfoByTitle";
  // 添加证件
  static URL_ADD_CRED = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/addCred";
  // 获取短信验证码
  static URL_SEND_VERIFY = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/sendVerify";
  // 获取邮箱验证码
  static URL_SEND_MAIL_VERIFY = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/sendMailVerify";
  // 找回密码
  static URL_GET_PAS = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/resetPassword";
  // 获取待审核头像
  static URL_GET_WAIT_CRED_ICON= MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/getWaitCredIcon";
  // 注销用户
  static URL_GET_CANCEL_REGISTER = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/user/cancelRegister";

  // 用户列表
  static URL_USER_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/list";
  // 筛选用户列表
  static URL_USER_SCREEN_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/screenList";
  // 筛选用户ID列表
  static URL_USER_SCREEN_LIST_ID = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/screenListId";
  static URL_USER_ITEM = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/userItem";
  // 用户详情
  static URL_USER_INTRODUCE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/introduce";
  // 用户基本信息
  static URL_USER_BASE_INFO = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/baseInfo";
  // 获取全部图片
  static URL_GET_ALL_PICTURE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/getAllPicture";
  // 获取大图
  static URL_GET_BIG_IMAGE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/getBigImage";
  // 获取Visiter谁访问过自己的url
  static URL_VISITER = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/getVisiters ";
  // 获取访问者人数
  static URL_HAS_VISITER = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/hasVisiters ";
  //异性逛一逛
  static URL_SEEEACHOTHER = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/goagoList";
  // 获取全部缩略图
  static URL_GET_ALL_SMALL_PICTURE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/home/getAllSmallPicture";

  // 喜欢的列表
  static URL_LIKE_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/likeList";
  // 讨厌的列表
  static URL_HATE_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/hateList";
  // 被喜欢的列表
  static URL_BE_LIKE_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/beLikeList";
  // 收藏的列表
  static URL_COLLECT_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/collectList";
  // 喜欢
  static URL_LIKE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/like";
  // 取消喜欢
  static URL_DIS_LIKE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/disLike";
  // 讨厌
  static URL_HATE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/hate";
  // 取消讨厌
  static URL_DIS_HATE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/disHate";
  // 无感
  static URL_IGNORE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/ignore";
  // 取消无感
  static URL_DIS_IGNORE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/disIgnore";
  // 收藏
  static URL_COLLECT = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/collect";
  // 取消收藏
  static URL_DIS_COLLECT = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/relation/disCollect";

  // 获取省份列表
  static URL_GET_PROVINCE_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/select/getProvinceList";
  // 获取城市列表
  static URL_GET_CITY_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/select/getCityList";
  // 获取地区列表
  static URL_GET_DISTRICT_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/select/getDistrictList";
  // 获取学校列表
  static URL_GET_SCHOOL_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/select/getSchoolList";
  // 添加学校
  static URL_ADD_SCHOOL = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/select/addSchool";

  // 获取最新app版本
  static URL_GET_LATEST_APP_VERSION = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/version/getLatestAppVersion";
  // 获取app下载url
  static URL_GET_APP_DOWNLOAD_URL = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/version/getAppDownloadUrl";

  // ios内购验证
  static URL_IAP_CERTIFICATE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/iap/newIapCertificate";
  //获取会员价格
  static URL_ORDER_PRICE = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/aliPay/getVipTypeList";
  //获取订单信息
  static URL_ORDER_INFO = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/aliPay/getPayInfo2";

  // 举报
  static URL_ADD_TIP = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/tip/addTip";
  // 获取举报类型列表
  static URL_TIP_TYPE_LIST = MyHttp.PROTOCOL + "://"  + MyHttp.IP + ":" + MyHttp.PORT + "/" + MyHttp.SERVER_NAME + "/tip/tipTypeList";

  constructor (private http : Http, public loadingCtrl:LoadingController, public myStorage : MyStorage,
               public memory: Memory, public alertCtrl: AlertController, public app:App) {
  }

  loader = this.loadingCtrl.create({
    content: "Please wait...",
  });

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
  post (url: string, body: any, success : Function, options?: RequestOptionsArgs, unLoader?) {
    if (options == null ) {
      options = {headers: new Headers()}
    }
    // console.log(unLoader)
    let loader = this.loadingCtrl.create({
      // spinner: "bubbles",
      showBackdrop : false
    });
    if (!unLoader) {
      loader.present();
    }
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.myStorage.getAccessToken(this.memory.getUser().id).then((token) => {
      if (token != null) {
        body['ACCESS_TOKEN'] = token;
      }
      console.log(options)
      this.http.post(url, this.body(body), options).subscribe((data) => {
        console.log(data)
        loader.dismiss();
        this.callBack(success, data);
      }, (error) => {
        console.log(error)
        loader.dismiss();
      });
    })

  }

  /**
   * 处理请求返回
   * @param success 成功的回调函数
   * @param data 数据
     */
  public alertIsShow = false;
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
        if (body.errorCode != null) {
          if(!this.alertIsShow){
            this.alertCtrl.create({
              title: "系统消息",
              subTitle: body.errorMessage + "(" +  + body.errorCode + ")",
              buttons: [{
                text: '关闭',
                handler: data => {
                  if (body.errorCode == 1001) {
                    /**
                     * 如果是需要重新登录
                     */
                    this.myStorage.setAccount(null);
                    this.myStorage.setPassword(null);
                    this.app.getRootNav().setRoot(StartPage);
                    this.myStorage.setUser(null);
                    this.memory.setUser({});
                  }
                }
              }]
            }).present();
          }
          this.alertIsShow = true;
        }
      } else {
        success(body);
      }
    }
  }




}
