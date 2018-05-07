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

  public setCommunicateList(userId, communicateList) {
    this.storage.set("communicateList:" + userId, communicateList);
  }

  public getCommunicateList(userId) {
    return this.storage.get("communicateList:" + userId)
  }

  addConversation(conversation) {


  }
}
