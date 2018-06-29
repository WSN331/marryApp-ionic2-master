import {ChangeDetectorRef, Component} from "@angular/core";
import {AlertController, Events, NavController} from "ionic-angular";

import {Memory} from "../../util/Memory";
import {MyStorage} from "../../util/MyStorage";
import {MyHttp} from "../../util/MyHttp";
import {ImgService} from "../../util/ImgService";
import {CalculateService} from "../../util/CalculateService";

import {PayPage} from "../purchase/pay";
import {MatchmakerPage} from "../matchmaker/matchmaker";
import {CommunicatePage} from "../communicate/communicate";
import {HomeIntroducePage} from "../home-introduce/home-introduce";
import {ContactPage} from "../contact/contact";
import {CredListPage} from "../credList/credList";
import {MessagePage} from "../message/message";


@Component({
  selector: 'page-peoples',
  templateUrl: 'people.html'
})

export class PeoplePage {

  //通信初始化有关
  public realTime;
  //本人
  public mySelf;
  //通话记录
  public conversations:any = [];
  public timer;
  //最近访问
  public isShow = false;


  constructor(public navCtrl:NavController, public memory:Memory, public events:Events,
              public changeDetectorRef:ChangeDetectorRef, public myHttp:MyHttp,
              public imgService:ImgService, public calculateService:CalculateService,
              public alertCtrl:AlertController, public myStorage: MyStorage) {
    this.init()
    this.ngReFresh();

    this.events.subscribe('e-people', (otherPersonId) => {
      for (let i = 0; i < this.conversations.length; i++) {
        let item = this.conversations[i];
        if (item["baseInfo"] != null && item["baseInfo"]["id"] == otherPersonId) {
          this.haveRead(this.conversations[i])
        }
      }
    });
  }

  doRefresh(refresher) {
    this.getCommunicateList();
    setTimeout(() => {
      refresher.complete();
    },2000);
  }

  /**
   * 初始化界面
   */
  init() {
    this.realTime = this.memory.getTiming();
    this.mySelf = this.memory.getUser().id;

    this.myStorage.getFirstIn().then((isFirst)=>{
      //判断是否是第一次访问
      if(isFirst == null){
        //是第一次访问
        this.myStorage.setFirstIn(false)
        this.getCommunicateList();
      }else{
        //不是第一次访问
        this.myStorage.getCommunicateList(this.mySelf).then((commList) => {
          if (commList != null) {
            //有缓存
            console.log("缓存赋值")
            this.conversations = commList

            //获取未读对话
            let unReadConversations = this.memory.getUnreadConversions();
            if(unReadConversations != null && unReadConversations.length > 0){
              for (var i = 0; i < unReadConversations.length; i++) {
                var CONVERSATION_ID = unReadConversations[i];
                this.realTime.createIMClient(this.mySelf + '').then((my)=> {
                  console.log("未读消息处理4")
                  my.getConversation(CONVERSATION_ID).then((conversation)=>{
                    console.log(conversation.id+"对话的id"+conversation.unreadMessagesCount)
                    console.log(conversation)
                    this.showMember(conversation);
                  }).catch(console.error.bind(console));
                }).catch(console.error);
              }
            }

          }
          if(this.conversations.size <= 0 || this.conversations == null || commList==null){
            //没有缓存
            this.getCommunicateList();
          }
        })
      }
    })
    /*this.getCommunicateList();*/

    this.hasVisiter();



  }

  /**
   * 刷新
   */
  ngReFresh() {
    //设置一个定时器，每秒刷新该界面
    this.timer = setInterval(()=> {
      //this.changeDetectorRef.detectChanges();
      this.getCommunicateList(2);
      console.log("1");
      this.saveConversations();

      let messageCount = 0;
      //获取未读消息条数，重新返回给tab界面
      for (let i = 0; i < this.conversations.length; i++) {
        let item = this.conversations[i];
        //count>0且能显示
        if(item.Count>0 && this.isToShow(item)){
          messageCount = messageCount+item.Count
        }
      }
      this.events.publish('e-tabs-message-change',messageCount);

    }, 2000);
  }

  /**
   * 是否有访问者
   */
  hasVisiter() {
    this.myStorage.getLastVisiterTime(this.mySelf).then((time) => {
      console.log(time)
      if (time == null) {
        this.isShow = true;
      } else {
        this.myHttp.post(MyHttp.URL_HAS_VISITER, {
          userId: this.mySelf,
          afterTime : time
        }, (data)=>{
          if(data['hasVisiters'] > 0) {
            this.isShow = true;
          }
        },null, true);
      }
    });

  }

  /**
   * 存储聊天记录
   */
  saveConversations() {
    let commList = [];
    for (let conversation of this.conversations) {
      let comm = {
        baseInfo: conversation.baseInfo,
        isDefaultPic: conversation.isDefaultPic,
        show: conversation.show,
        lastMessageAt:conversation.lastMessageAt,
        Minutes:conversation.Minutes,
        Hour:conversation.Hour,
        Date:conversation.Date,
        Month:conversation.Month,
        Count:conversation.Count,
        talk:''
      };
      commList[commList.length] = comm;
    }
    this.myStorage.setCommunicateList(this.mySelf, commList)
  }

  /**
   * 退出页面
   */
  ngOnDestroy() {
    if (this.timer) {
      this.changeDetectorRef.detach();
      clearInterval(this.timer);
    }
  }

  /**
   * 用户登录并监听消息
   */
  getCommunicateList(secondAgo?) {

    if (this.memory.getConversion().size > 0 && this.memory.getConversion() != null) {
      this.conversations = this.memory.getConversion();
    }

    this.realTime.createIMClient(this.mySelf + '').then((my)=> {

      let myQuery = my.getQuery();

      if (secondAgo != null && !isNaN(secondAgo)) {
        let time = new Date(Date.now() - secondAgo * 1000);
        myQuery.greaterThan('lm', time);
      }

      myQuery.limit(100).containsMembers([this.mySelf + '']).find().then((conversations)=> {
        for (var i = conversations.length-1; i>=0; i--) {
          this.showMember(conversations[i]);
        }

      }).catch(console.error.bind(console));
    }).catch(console.error);
  }

  /**
   * 开始对话
   */
  goToTalk(conTalk:any) {
    //如果当前用户是vip用户则可以开始聊天
    if (this.isVipOrNot()) {
      conTalk.Count = 0;
      this.saveConversations();
      //通话对象
      if (conTalk['baseInfo'] != null) {

        this.navCtrl.push(CommunicatePage, {
          person: conTalk['baseInfo'],
          /*talkmsg: talk*/
        });
      } else {
        console.log("聊天对象id有问题");
      }
    } else {
      //当前用户不是vip用户,那么就发出善意的提醒
      this.backMessage();
    }
  }

  //获取对话人的id
  getPersonId(talk:any){
    let otherPerson = null
    let comPeople = talk.members.toString().split(',');
    for (let person of comPeople) {
      if (person != this.mySelf) {
        otherPerson = person.trim();
      }
    }
    return otherPerson
  }
  /**
   * 获取对话人的姓名,图片
   * @param talk
   */
  showMember(talk:any) {
    let conversation:any = {
      baseInfo: '',
      detailInfo: '',
      lastMessageAt: '',
      Minutes: '',
      Hour: '',
      Date: '',
      Month: '',
      Count: '',
      isDefaultPic: '',
      talk:'',
      show: false
    }

    if(talk.lastMessageAt!=null){
      conversation.lastMessageAt = talk.lastMessageAt,
      conversation.Minutes = talk.lastMessageAt.getMinutes()
      conversation.Hour = talk.lastMessageAt.getHours()
      conversation.Date = talk.lastMessageAt.getDate()
      conversation.Month = talk.lastMessageAt.getMonth()
      conversation.Count = talk.unreadMessagesCount
    }
    conversation.talk = talk;

    //对话人账户
    let otherPerson = this.getPersonId(talk)
/*    let otherPerson = null;
    let comPeople = talk.members.toString().split(',');
    for (let person of comPeople) {
      if (person != this.mySelf) {
        otherPerson = person.trim();
      }
    }*/

    if (otherPerson != null) {
      console.log(otherPerson + "对话人的id");

      this.addConversation(otherPerson, conversation);

      this.getUserInfo(otherPerson, (baseInfo, isDefaultPic, relation)=> {

        console.log(baseInfo.nickName + "用户姓名");
        conversation.baseInfo = baseInfo;
        conversation.isDefaultPic = isDefaultPic;

        if (relation != "2") {
          conversation.show = true;
        }
        //调整conversations
        this.isToAdd(conversation,otherPerson)
        this.memory.setConversion(this.conversations);

      })
    }
  }

  /**
   * 将聊天添加到列表中
   * @param personId
   * @param conversation
     */
  addConversation(personId, conversation) {
    console.log("显示长度："+this.conversations.length)
    let count = 0
    for (let i = 0; i < this.conversations.length; i++) {
      let item = this.conversations[i];
      if (item["baseInfo"] != null && item["baseInfo"]["id"] == personId) {
        count = item.Count
        for (let j = i; j < this.conversations.length - 1; j++) {
          this.conversations[j] = this.conversations[j+1];
        }
        this.conversations.pop();
      }
    }
    var conList = [];
    conList.push(conversation);
    this.conversations = conList.concat(this.conversations)
  }

  /**
   * 判断是否显示，也就是是否是删除的
   * @param conTalk
   * @param otherId
   */
  isToAdd(conTalk:any,otherId){
    let isShow = true
    //获取一下删除的会话
    this.myStorage.getDeleteTalk(this.mySelf).then((deleteList)=>{
      if(deleteList != null){
        console.log(deleteList)
          for(let i=0;i<deleteList.length;i++){
            if(conTalk.baseInfo.id == deleteList[i]){
              //如果要显示的对话在删除的会话里面，在判断是否有新消息
              if(conTalk.Count>0){
                //有新消息就显示，且从删除对话中移除,从i下标开始,删除一个元素
                deleteList.splice(i,1)
                this.myStorage.setDeleteTalk(this.mySelf,deleteList)
              }else{
                //在删除对话里面，没有新消息就不显示
                isShow = false;
              }
            }
          }
          if(!isShow){
            //不显示的，那么就删除
            for (let i = 0; i < this.conversations.length; i++) {
              let item = this.conversations[i];
              if (item["baseInfo"] != null && item["baseInfo"]["id"] == otherId) {
                for (let j = i; j < this.conversations.length - 1; j++) {
                  this.conversations[j] = this.conversations[j+1];
                }
                this.conversations.pop();
              }
            }
          }
      }
    })
  }

  /**
   * 获取用户信息
   */
  getUserInfo(otherUserId, callBack:Function) {
    console.log(this.memory.getUser().id + "-" + otherUserId + "对话")
    this.myHttp.post(MyHttp.URL_USER_BASE_INFO, {
      userId: this.memory.getUser().id,
      otherUserId: otherUserId
    }, (data) => {
      console.log(data)
      let baseInfo = data.baseInfo || {};
      // let detailInfo = data.detailInfo || {};
      let isDefaultPic = data.isNotChangeIcon;
      let relation = data.relation;
      callBack(baseInfo, isDefaultPic, relation);
    }, null, true)
  }

  /**
   * 去到个人详情界面
   */
  goToIntroduce(user:any) {
    this.navCtrl.push(HomeIntroducePage, {baseInfo: user});
  }

  /*
   * 将该页面拿出堆栈
   * */
  back() {
    this.navCtrl.pop();
  }

  /**
   * 判断当前用户是否是VIP用户
   */
  isVipOrNot():boolean {
    return this.calculateService.isVip(this.memory.getUser().vipTime)
  }


  /**
   *  成为VIP
   */
  backMessage() {
    let prompt = "亲~成为尊敬的Vip用户才能给对方发信息哦";
    this.alertCtrl.create({
      message: prompt,
      buttons: [
        {
          text: '狠心放弃'
        },
        {
          text: '立刻成为',
          handler: ()=> {
            //去到vip页面
            this.navCtrl.push(PayPage);
          }
        }

      ]
    }).present();
  }

  /**
   * 心动记录
   */
  goToContact() {
    if (!this.isCredMain()) {
      this.goToCred();
    } else {
      this.navCtrl.push(ContactPage);
      //红色小点显示
      this.memory.setLike(false);
    }
  }

  goToPeople() {
    if (!this.isCredMain()) {
      this.goToCred();
    } else {
      this.navCtrl.push(MessagePage);
      this.isShow = false;
    }
  }

  //小红娘
  goToMatcher() {
    if (!this.isCredMain()) {
      this.goToCred();
    } else {
      this.navCtrl.push(MatchmakerPage);
      this.memory.setMsg(false);
    }
  }

  /**
   * 判断是否验证
   * @returns {boolean}
   */
  isCredMain() {
    return this.memory.getUser().mainCredNum >= 3;
  }

  /**
   * 认证信息提示
   */
  goToCred() {
    this.alertCtrl.create({
      message: '亲~请先认证信息才能查看更多内容',
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


  /*将对话标记为已读*/
  haveRead(conTalk:any){
    conTalk.Count = 0;
    this.saveConversations();
    if(conTalk.talk !=''){
      conTalk.talk.read().then((conversation)=> {
        console.log('对话已标记为已读');
      }).catch(console.error.bind(console));
    }
  }


  /*删除对话*/
  deleteTalk(conTalk:any){
    //记录一下删除的会话
    this.myStorage.getDeleteTalk(this.mySelf).then((deleteList)=>{
      if(deleteList == null){
        deleteList = []
      }
      //不重复添加
      for(let i=0;i<deleteList.length;i++){
        if(conTalk.baseInfo.id == deleteList[i]){
          return;
        }
      }
      deleteList.push(conTalk.baseInfo.id)
      this.myStorage.setDeleteTalk(this.mySelf,deleteList)
    })

    for (let i = 0; i < this.conversations.length; i++) {
      let item = this.conversations[i];
      if (item["baseInfo"] != null && item["baseInfo"]["id"] == conTalk.baseInfo.id) {
        for (let j = i; j < this.conversations.length - 1; j++) {
          this.conversations[j] = this.conversations[j+1];
        }
        this.conversations.pop();
      }
    }
  }

  //判断是否可以显示
  isToShow(conTalk:any){
    let isShow = true
    //照片不行，被拉黑，没有信息交流的，不能显示
    if(conTalk.isDefaultPic == true || conTalk.show == false || conTalk.lastMessageAt == ''
      ||conTalk.baseInfo.nickName == '' || this.calculateService.getAge(conTalk.baseInfo.birthday) == 0){
      isShow = false
    }
    return isShow;
  }
}

