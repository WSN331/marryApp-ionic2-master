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

  addConversation(conversation) {
  }


}
