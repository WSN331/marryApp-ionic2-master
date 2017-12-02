import {ChangeDetectorRef, Component} from "@angular/core";
import {Events, LoadingController, NavController} from "ionic-angular";

import {Memory} from "../../util/Memory";
import {CommunicatePage} from "../communicate/communicate";
import {MyHttp} from "../../util/MyHttp";
import {ImgService} from "../../util/ImgService";



@Component({
  selector:'page-peoples',
  templateUrl:'people.html'
})

export class PeoplePage{

  //通信初始化有关
  public realtime;
  //本人
  public mySelf;
  //通话记录
  public conversations:any = [];
  constructor(public navCtrl:NavController,public memory:Memory,
              public loadingCtrl:LoadingController,public events: Events,
              public changeDetectorRef:ChangeDetectorRef,public myHttp : MyHttp,
              public imgService: ImgService){
    this.login();
    this.ngReFresh();
    this.events.subscribe('e-people', () => {
    });
  }

  public timer;
  ngReFresh(){
    //设置一个定时器，每秒刷新该界面
    this.timer = setInterval(()=>{
      this.changeDetectorRef.detectChanges();
      console.log("1");
    },1000);
  }
  ngOnDestroy(){
    if(this.timer){
      this.changeDetectorRef.detach();
      clearInterval(this.timer);
    }
  }

  public loader = this.loadingCtrl.create({
    content: "Please wait...",
  });
  /**
   * 用户登录并监听消息
   */
  login(){
    this.realtime = this.memory.getTiming();
    this.mySelf = this.memory.getUser().id;

    this.loader.present();

    this.realtime.createIMClient(this.mySelf+'').then((my)=>{
      //查找对话是否存在
      my.getQuery().limit(100).containsMembers([this.mySelf+'']).find().then((conversations)=>{
        console.log(conversations.length);
        for(let talk of conversations){
          this.showMember(talk);
        }
        this.loader.dismiss();
      }).catch(console.error.bind(console));
    }).catch(console.error);
  }



  public comTalk;
  /**
   * 开始对话
   */
  goToTalk(talk:any) {
      this.comTalk = talk;
      //通话对象
      let personId = null;
      let list = talk.members.toString().split(',');
      if(list !=null){
        for(let person of list){
          if(person != this.mySelf){
            personId = person;
          }
        }
      }
      //通话对象
      console.log(personId);
      if(personId!=null){
        this.memory.setMsg(false);
        this.navCtrl.push(CommunicatePage,{
          person:personId,
          talkmsg:talk
        });
      }else{
        console.log("聊天对象id有问题");
      }
    }


  /**
   * 获取对话人的姓名,图片
   * @param talk
   */
  showMember(talk:any){
    //对话人账户
    let otherPerson = null;
    let comPeople = talk.members.toString().split(',');
    for(let person of comPeople){
      if(person!=this.mySelf){
        otherPerson = person.trim();
      }
    }

    if(otherPerson!=null){
      console.log(otherPerson+"对话人的id");
      this.getUserInfo(otherPerson,(baseInfo)=>{
        console.log(baseInfo.nickName+"用户姓名");
        let conversation:any = {
            baseInfo:'',
            talk:''
          }
        conversation.baseInfo = baseInfo;
        conversation.talk = talk;
        this.conversations.push(conversation);
        /*this.changeDetectorRef.detectChanges();*/
      })
    }
  }

  /**
   * 获取用户信息
   */
  getUserInfo(otherUserId,callBack:Function) {
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.memory.getUser().id,
      otherUserId: otherUserId
    }, (data) => {
      console.log(data)
      let baseInfo = data.baseInfo || {};

      callBack(baseInfo);
    })
  }

  /*
  * 将该页面拿出堆栈
  * */
  back(){
    this.navCtrl.pop();
  }


}

