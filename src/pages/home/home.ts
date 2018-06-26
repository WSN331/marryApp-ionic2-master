import {Component, ViewChild, ChangeDetectorRef  } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Content } from 'ionic-angular';
import { Events } from 'ionic-angular';

import {MyHttp} from '../../util/MyHttp';
import {Memory} from '../../util/Memory'
import {ImgService} from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'

import {HomeIntroducePage} from '../../pages/home-introduce/home-introduce'
import {StartPage} from "../start/start";
import {UserDetailPage} from "../user-detail/user-detail"
import {CredListPage} from "../credList/credList";
import {PayPage} from "../purchase/pay";
import {SearchPage} from "../search/search";
import {CommunicatePage} from "../communicate/communicate";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild(Content) content: Content;　　//获取界面Content的实例对象
  private PAGE_SIZE = 10;

  //
  public nullUserID = Math.ceil(Math.random()*1000)

  /**
   * 婚配对象列表
   */
  public userList = [];

  public userIdList = [];

  public id;

  public pageIndex;

  public displayTitle = true;

  private showBtnGetMore = false;

  /*
  * 身高，年龄，收入，学历，当前所在地，故乡
  * */
  public searchInfo;

  //判断是否是从搜索页面过来的
  public isSearch;

  public notMoreUser;

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public alertCtrl:AlertController,
              public memory:Memory, public imgService:ImgService, public events: Events,
              public calculateService: CalculateService, private cdr: ChangeDetectorRef,
              public toastCtrl: ToastController) {

    if(this.isLoginOnce()){
      this.goToDetail();
    } else if(!this.isCredMain()){
      this.goToCred();
    }

    this.initSearchInfo();
    // 初始化userList
    this.initUserList();

    // 添加初始化的声明
    this.events.subscribe('e-home-list', () => {
      this.initUserList();
    });

    // 添加搜索回调
    this.events.subscribe('e-home-search', (searchInfo,isSearch)=>{
      for(let name in searchInfo){
        this.searchInfo[name] = searchInfo[name];
      }
      console.log(this.searchInfo);
      this.isSearch = isSearch;
      this.initUserList();
    });

    // 添加修改userInfo的回调
    this.events.subscribe('e-home-changeUserInfo', (userId, changeInfo) => {
      console.log(userId + ";");
      console.log(changeInfo)
      this.changeUserInfo(userId, changeInfo);
    })
  }

  initSearchInfo() {
    this.searchInfo =  {
      high : '',
      age : '',
      income : '',
      edu : '',
      screenSchoolAndDistrict: ""
    };
    this.isSearch = 0;
  }

  /**
   * 初始化用户列表
   */
  initUserList() {
    this.userList = [];
    this.userIdList = [];
    this.pageIndex = 0;
    this.notMoreUser = false;
    this.nextPage();
  }

  /**
   * emmmmmmmm
   */
  ngAfterViewInit() {
    this.content.ionScroll.subscribe(event => {
      // console.log(event)
      if (event.directionY == "down") {
        this.displayTitle = false;
        document.getElementById("head").style.opacity ="0";
      } else {
        this.displayTitle = true;
        document.getElementById("head").style.opacity ="1";
      }
    });
  }

  /**
   * 修改用户的信息（mdddddd智障）
   * @param userId
   * @param changeInfo
     */
  changeUserInfo(userId, changeInfo) {
    for (let info of this.userList) {
      if (info["id"] == userId) {
        for (let name in changeInfo) {
          info[name] = changeInfo[name];
        }
      }
    }
    console.log(this.userList);
  }

  /**
   * 下拉刷新
   * @param refresher
     */
  doRefresh(refresher) {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    if(this.isSearch){
      //刷新后重新显示
      this.initSearchInfo();
    }
    this.initUserList();
    setTimeout(() => {
      refresher.complete();
    },2000);
  }

  /**
   * 上拉加载
   * @param infiniteScroll
     */
  doInfinite(infiniteScroll) {
    console.log(this.showBtnGetMore)
    if (this.showBtnGetMore) {
      setTimeout(() => {
        this.nextPage();
        infiniteScroll.complete();
      }, 500);
    }
  }

  /**
   * 请先购买VIP
   */
  nextPage() {
    if(!this.isLogin()){
      //没有登录
      this.goToLogin();
    }else{
      this.pageIndex ++;
      this.getUserListId(this.searchInfo, () => {
        this.getUserList();
      }, true)
    }
  }

  /**
   * 获取用户列表
     */
  getUserList() {
    if (this.userIdList.length > this.userList.length) {
      this.getUserItem();
    } else {
      this.showBtnGetMore = true;
    }
  }

  // 先获取所有匹配用户的id
  getUserListId(searchInfo, nextDoing: Function, notDialog?) {
    if (this.isLogin()) {
      this.id = this.memory.getUser().id;
      console.log(this.id+"现在登录的id")
      searchInfo['userId'] = this.id;
      searchInfo['size'] = this.PAGE_SIZE;
      searchInfo['index'] = this.pageIndex;
      if (this.id) {
        this.showBtnGetMore = false;
        this.myHttp.post(MyHttp.URL_USER_SCREEN_LIST_ID, searchInfo, (data) => {
          console.log(data)
          if (typeof data.userList !== "undefined") {
            this.userIdList = this.userIdList.concat(data.userList);
            this.notMoreUser = false;
          } else {
            this.notMoreUser = true;
          }
          nextDoing();
        }, null, notDialog);
      }
    }
  }

  // 单独获取UserList
  getUserItem() {
    let size = this.userList.length;
    console.log(this.userIdList)
    console.log(size)
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.id,
      otherUserId: this.userIdList[size]
    }, (data) => {
      console.log(data)
      let item = data.baseInfo;
      item.detailInfo = data.detailInfo;
      item.relation = data.relation;
      this.userList.push(item);
      this.getUserList();
    }, null, true)
  }

  /**
   *
   * @param userId
   */
  getIntroduce(user:any) {
    if (!this.isLogin()) {
      //是否登录
      this.goToLogin();
    } else if(!this.isCredMain()){
      this.goToCred();
    } else{
      this.navCtrl.push(HomeIntroducePage, {baseInfo: user})
    }
  }


  /**
   * 从List中去掉选中的user
   * @param user
   */
  deleteFromList(event,id){
    this.ignore(event, id)
  }

  /**
   * 是否认证
   * @returns {boolean}
     */
  isCredMain() {
    return this.memory.getUser().mainCredNum >= 3;
  }

  /**
   * 判断是否是第一次登陆
   */
  isLoginOnce(){
    let user = this.memory.getUser();
    //判断是否是真实登录
    if(this.isLogin()){
      if(user.nickName === ''||user.name===''||(user.sex !==0 && user.sex !==1)||user.birthday===''){
        return true;
      }
    }
    return false;
  }

  /**
   * 去完善信息
   */
  goToDetail(){
    this.alertCtrl.create({
      message: '亲~请先完善您的信息(第一页信息必须填写完整)',
      buttons: [{
        text: 'OK',
        handler: ()=> {
          this.navCtrl.push(UserDetailPage);
        }
      }]
    }).present();
  }

  /**
   * 去到购买Vip界面
   */
  goToBuyVip(){
    this.alertCtrl.create({
      message: '亲~请先购买VIP',
      buttons: [{
        text:'NO'
      },
        {
          text: 'OK',
          handler: ()=> {
            this.navCtrl.push(PayPage);
          }
        }

      ]
    }).present();
  }

  /**
   * 认证信息提示
   */
  goToCred() {
    this.alertCtrl.create({
      message: '亲~请先认证信息才能查看更多完整信息',
      buttons: [
        {
          text: 'NO'
        },
        {
          text: 'OK',
          handler: ()=> {
            this.navCtrl.push(CredListPage);
          }
        }
      ]
    }).present();
  }

  /**
   * 未登录
   */
  goToLogin() {
    this.alertCtrl.create({
      message: '亲~请先登录才能查看更多完整信息',
      buttons: [{
        text: 'OK',
        handler: ()=> {
          this.memory.setSex({});
          this.navCtrl.setRoot(StartPage);
        }
      }]
    }).present();
  }

  /**
   * 进入查询界面
   */
  goToSearch() {
    if (!this.isLogin()) {
      this.goToLogin()
    } else if(!this.isCredMain()){
      this.goToCred();
    }else{
      this.navCtrl.push(SearchPage);
    }
    /*this.searchPub("暂未开放");*/
  }

  /**
   * 判断是否登录
   * @returns {any}
     */
  isLogin() {
    return this.memory.getUser().id ? true : false;
  }


  /**
   * 提示框
   * @param subTitle
   */
  searchPub(subTitle: string) {
    this.alertCtrl.create({
      title: "消息",
      subTitle: subTitle,
      buttons: ["关闭"]
    }).present();
  }

  /**
   * 喜欢
   * @param user
     */
  like(event, index) {
    this.cdr.detach();
    this.changeRelation(0, this.userList[index].id, (data)=> {
      if (data.likeResult == "0") {
        this.userList[index].relation = 1;
        this.cdr.reattach();
      }
    })
    event.stopPropagation();
  }

  /**
   * 取消喜欢
   * @param user
   */
  disLike(event, index) {
    this.cdr.detach();
    this.changeRelation(2, this.userList[index].id, (data)=> {
      if (data.disLikeResult == "0") {
        this.userList[index].relation = 0;
        this.cdr.reattach();
      }
    })
    event.stopPropagation();

  }

  /**
   * 屏蔽
   * @param user
     */
  hate(event, index) {
    this.changeRelation(1, this.userList[index].id, (data)=> {
      if (data.hateResult == "0") {
        for (index; index < this.userList.length-1; index++) {
          this.userList[index] = this.userList[index+1];
        }
        this.userList.pop();
      }
    })
    event.stopPropagation();
  }

  // 无感
  ignore(event, index) {
    this.changeRelation(6, this.userList[index].id, (data)=> {
      if (data.hateResult == "0") {
        for (index; index < this.userList.length-1; index++) {
          this.userList[index] = this.userList[index+1];
        }
        this.userList.pop();
      }
    })
    event.stopPropagation();
  }

  /**
   *
   * @param type 0喜欢，1讨厌，2取消喜欢，3取消讨厌，4收藏，5取消收藏
   */
  changeRelation(type: number, toUserId, successBack:Function) {
    let url = [MyHttp.URL_LIKE,MyHttp.URL_HATE,MyHttp.URL_DIS_LIKE,MyHttp.URL_DIS_HATE,MyHttp.URL_COLLECT,MyHttp.URL_DIS_COLLECT, MyHttp.URL_IGNORE, MyHttp.URL_DIS_IGNORE][type];
    this.myHttp.post(url, {
      userId: this.memory.getUser().id,
      toUserId: toUserId
    }, (data) => {
      //点击喜欢
      if(type===0){
        this.memory.setLike(true);
      }
      successBack(data);
    })
  }

  // 前往聊天界面
  goToMessage(event, user) {
    if(this.calculateService.isVip(this.memory.getUser().vipTime)){
      this.navCtrl.push(CommunicatePage,{
        person:user
      });
    }else{
      //当前用户不是vip用户,那么就发出善意的提醒
      let prompt = "亲~成为尊敬的Vip用户才能查看对方给你发来的信息哦";
      this.alertCtrl.create({
        message: prompt,
        buttons: [
          {
            text:'狠心放弃'
          },
          {
            text:'立刻成为',
            handler:()=>{
              //去到vip页面
              this.navCtrl.push(PayPage);
            }
          }

        ]
      }).present();
    }
    event.stopPropagation();
  }
}
