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
  private PAGE_SIZE = 5;
  //


  /**
   * 婚配对象列表
   */
  public userList = [];

  public id;
  public pageIndex;

  public displayTitle = true;

  private showBtnGetMore = false;

  /*
  * 身高，年龄，收入，学历，当前所在地，故乡
  * */
  public searchInfo =  {
    high : '',
    age : '',
    income : '',
    edu : ''
  };

  //判断是否是从搜索页面过来的
  public isSearch;

  // @ViewChild("homeSlides") slides: Slides;

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public alertCtrl:AlertController,
              public memory:Memory, public imgService:ImgService, public events: Events,
              public calculateService: CalculateService, private cdr: ChangeDetectorRef,
              public toastCtrl: ToastController) {
    this.pageIndex = 1;
    this.getUserList(this.searchInfo);
    this.events.subscribe('e-home-list', () => {
      this.pageIndex = 1;
      this.userList = [];
      this.getUserList(this.searchInfo);
    });
    this.events.subscribe('e-home-search', (searchInfo,isSearch)=>{
      this.pageIndex = 1;

      for(let name in searchInfo){
        this.searchInfo[name] = searchInfo[name];
      }
      console.log(this.searchInfo);

      this.isSearch = isSearch;
      this.userList = [];
      this.getUserList(this.searchInfo);
    })
  }



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

  doRefresh(refresher) {
    if(this.isSearch){
      //刷新后重新显示
      this.searchInfo = {
        high : '',
        age : '',
        income : '',
        edu : '',
      };
    }
    this.pageIndex = 1;
    this.userList = [];
    this.getUserList(this.searchInfo);
    setTimeout(() => {
      refresher.complete();
    },2000);
  }

  /**
   * 请先购买VIP
   */
  nextPage() {
    if(!this.isLogin()){
      //没有登录
      this.goToLogin();
    }else{
      //第一次登陆
      if(this.isLoginOnce()){
        //去完善信息
        this.goToDetail();
      }else{
        //是否通过认证
        if(this.isCredMain()){
          //通过认证就可以
          this.pageIndex ++;

          console.log(this.searchInfo);

          this.getUserList(this.searchInfo);
/*          if (this.calculateService.isVip(this.memory.getUser().vipTime)) {
            //登录了，且是VIP
          }else{
            //登录了，不是VIP
            this.goToBuyVip()
          }*/
        }else{
          //没有通过认证
          this.goToCred();
        }
      }
    }
  }

  /**
   * 获取用户列表
   * @param searchInfo
     */
  getUserList(searchInfo:any) {
    /**
     * 每次先获取一张
     */
    this.showBtnGetMore = false;
    this.getUserListStep(searchInfo, 1, false);


  }

  getUserListStep(searchInfo:any, i:number, notDialog) {
    this.doGetUserList(searchInfo, 1, this.userList.length + 1,(userList)=>{
      console.log(userList)
      this.userList = this.userList.concat(userList);
      if (i < this.PAGE_SIZE) {
        this.getUserListStep(searchInfo, i+1, true);
      } else {
        this.showBtnGetMore = true;
      }
    }, notDialog);
  }

  /**
   * 实施获取用户列表
   */
  doGetUserList(searchInfo:any, pageSize, pageIndex, funcAddList : Function, notDialog) {
    if (this.isLogin()) {
      this.id = this.memory.getUser().id;
      console.log(this.id+"现在登录的id")
      searchInfo['userId'] = this.id;
      searchInfo['size'] = pageSize;
      searchInfo['index'] = pageIndex;
      if (this.id) {
        this.myHttp.post(MyHttp.URL_USER_SCREEN_LIST, searchInfo, (data) => {
          console.log(data)
          if (data.listResult === '0') {
            if(!this.isLoginOnce()){
              funcAddList(data.userList);
            }else{
              this.goToDetail();
            }
          } else if (data.listResult === '1'){
            this.alertCtrl.create({
              message: '没有更多用户啦',
              buttons: [{
                text: 'OK',
                handler: ()=> {
                }
              }]
            }).present();
          } else if (data.listResult === '2'){

          }

          //提示用户有未读消息
          let isMsg = this.memory.getMsg();
          if(isMsg){
            this.searchPub("又有人找您啦~");
          }
        }, null, notDialog);
      }
    }else{
      let sex = this.memory.getSex();
      console.log(this.id+"观光的id")

      this.myHttp.post(MyHttp.URL_SEEEACHOTHER, {
        sex:sex,
        size: 2
      }, (data) => {
        console.log(data)
        if (data.listResult === '0') {
            this.userList = data.userList;
        }
      })
    }

  }

  /**
   *
   * @param userId
   */
  getIntroduce(userId:any) {
    if (!this.isLogin()) {
      //是否登录
      this.goToLogin();
    } else if (!this.isCredMain()) {
      //是否通过认证
      this.goToCred();
    } else {
      this.navCtrl.push(HomeIntroducePage, {otherUserId: userId})
    }
  }


  /**
   * 从List中去掉选中的user
   * @param user
   */
  deleteFromList(event,id){
    this.userList.splice(id,1);
    event.stopPropagation();
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
   * 无感
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

  /**
   *
   * @param type 0喜欢，1讨厌，2取消喜欢，3取消讨厌，4收藏，5取消收藏
   */
  changeRelation(type: number, toUserId, successBack:Function) {
    let url = [MyHttp.URL_LIKE,MyHttp.URL_HATE,MyHttp.URL_DIS_LIKE,MyHttp.URL_DIS_HATE,MyHttp.URL_COLLECT,MyHttp.URL_DIS_COLLECT][type];
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

  goToMessage(event, user) {
    if(this.calculateService.isVip(this.memory.getUser().vipTime)){
      this.navCtrl.push(CommunicatePage,{
        person:user.id
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
