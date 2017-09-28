/**
 * Created by ASUS on 2017/8/30 0030.
 */
 export class Memory{
  constructor() {
  }

  private user = {};
  private sex = {};

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
