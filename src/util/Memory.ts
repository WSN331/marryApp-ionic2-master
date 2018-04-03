/**
 * Created by ASUS on 2017/8/30 0030.
 */
 export class Memory{
  constructor() {
  }

  private user = {};
  private sex = {};
  //未读消息设置
  private msg = false;
  //添加喜欢设置
  private like=false;

  //通信工具初始化
  private realTiming=null;
  //数据库初始化
  private dataBase = null;

  //添加聊天人缓存
  private conversions:any = [];

  public setConversion(conversions){
    this.conversions = conversions;
  }
  public getConversion(){
    return this.conversions;
  }

  public setDB(dataBase){
    this.dataBase = dataBase;
  }
  public getDB(){
    return this.dataBase;
  }

  public setLike(like){
    this.like = like;
  }

  public getLike(){
    return this.like;
  }

  public getTiming() {
    return this.realTiming;
  }

  public setTiming(realTiming) {
    this.realTiming = realTiming;
  }

  public setMsg(msg){
    this.msg = msg;
  }

  public getMsg(){
    return this.msg;
  }

  public setUser(user : any) {
    this.user = user;
  }

  public getUser() : any {
    return this.user;
  }

  public setSex(sex:any){
    this.sex = sex;
  }

  public getSex(){
    return this.sex;
  }
  
  
  
}
