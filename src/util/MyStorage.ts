/**
 * Created by Administrator on 2018/4/3 0003.
 */
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage'


@Injectable()
export class MyStorage {

  constructor(public storage:Storage) {

  }

  public getUserInfo(userId) {
    return this.storage.get(userId);
  }

  public setUserInfo(userId, val) {
    this.storage.set(userId, val);
  }

  public getUser() {
    return this.storage.get('user');
  }

  public setUser(user) {
    this.storage.set("user", user);
  }

  public getAccount() {
    return this.storage.get('account');
  }

  public getPassword() {
    return this.storage.get('password');
  }

  public setAccount(account) {
    this.storage.set("account", account);
  }

  public setPassword(password) {
    this.storage.set("password", password);
  }

  public setFirstIn(isFirst){
    this.storage.set("isFirst",isFirst)
  }
  public getFirstIn(){
    return this.storage.get("isFirst")
  }

  public setCommunicateList(userId, communicateList) {
    this.storage.set("communicateList:" + userId, communicateList);
  }

  public getCommunicateList(userId) {
    return this.storage.get("communicateList:" + userId)
  }

  public setDeleteTalk(userId,deleteList){
    this.storage.set("deleteList:" + userId, deleteList);
  }

  public getDeleteTalk(userId){
    return this.storage.get("deleteList:" + userId);
  }

  public setBeLikeList(userId, list) {
    this.storage.set("beLikeList:" + userId, list);
  }

  public getBeLikeList(userId) {
    return this.storage.get("beLikeList:" + userId)
  }

  public setLikeList(userId, list) {
    this.storage.set("likeList:" + userId, list);
  }

  public getLikeList(userId) {
    return this.storage.get("likeList:" + userId)
  }

  public setHateList(userId, list) {
    this.storage.set("hateList:" + userId, list);
  }

  public getHateList(userId) {
    return this.storage.get("hateList:" + userId)
  }

  public setAccessToken(userId, token) {
    this.storage.set("accessToken:" + userId, token);
  }

  public getAccessToken(userId) {
    return this.storage.get("accessToken:" + userId);
  }

  public setMsgList(userId, otherId, list) {
    // console.log(JSON.stringify(list))
    this.storage.set("msgList:" + userId + "&" + otherId, list);
  }

  public getMsgList(userId, otherId) {
    return this.storage.get("msgList:" + userId + "&" + otherId);
  }

  public setLastVisiterTime(userId, time) {
    this.storage.set("lastVisiterTime:" + userId, time);
  }

  public getLastVisiterTime(userId) {
    return this.storage.get("lastVisiterTime:" + userId);
  }

  public getIapCertificate(userId) {
    console.log("*******certificate get:" + userId)
    return this.storage.get("iapCertificate:" + userId);
  }

  public addIapCertificate(userId, receipt, vipId) {
    console.log("*******certificate add:")

    let certificate = {
      receipt : receipt,
      vipId : vipId,
      used: 0
    };
    this.getIapCertificate(userId).then((data) => {
      console.log("*******certificate add then:" + data)
      if (data == null) {
        console.log("*******certificate add then data is null")
        console.log("*******certificate add then data is null")
        data = [];
      }
      data.push(certificate);
      console.log("*******certificate add:" + certificate)
      this.storage.set("iapCertificate:" + userId, data)
    }).catch((error) => {
      console.log("*******certificate add error:" + error)
    })
    return certificate;
  }

  usedIapCertificate(userId, certificate: any) {
    this.getIapCertificate(userId).then((data) => {
      console.log("*******certificate used then:" + data)
      if (data == null) {
        console.log("*******certificate used then data is null")
        data = [];
      } else {
        for (let cert of data) {
          console.log("*******certificate used foreach compare " + cert["transactionId"] == certificate["transactionId"])
          if (cert["transactionId"] == certificate["transactionId"]) {
            console.log("*******certificate used this one :" + JSON.stringify(cert))
            cert["used"] = 1
          }
        }
      }
      this.storage.set("iapCertificate:" + userId, data)
    })
  }

  addConversation(conversation) {
  }


}
