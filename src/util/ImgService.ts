/**
 * Created by ASUS on 2017/9/7 0007.
 */
import {Injectable} from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AlertController } from 'ionic-angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable()
export class ImgService {

  /**
   * 相机参数
   * @type {{quality: number, destinationType: number, encodingType: number, mediaType: number}}
     */
  private cameraOptions: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 500,
    targetHeight: 500,
    allowEdit: true,
    saveToPhotoAlbum: false
  }

  /**
   * 相册选择图片参数
   * @type {ImageResizerOptions}
     */
  private chooseOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
    allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 500,
    targetHeight: 500,
    saveToPhotoAlbum: false
  }

  constructor(private camera: Camera, public alertCtrl: AlertController, private sanitize:DomSanitizer) {
  }

  /**
   * 启动相机
   * @param success
     */
  startCamera(success: Function) {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      success(this.encodeAdd(imageData));
    }, (err) => {
      console.log(err);
      //this.failError("调用相机失败");
    });
  }

  /**
   * 启用相册
   * @param success
     */
  chooseCamera(success: Function) {
    this.camera.getPicture(this.chooseOptions).then((imageData) => {
      success(this.encodeAdd(imageData));
    }, (err) => {
      console.log(err);
      //this.failError("调用相机失败");
    });
  }

  /**
   * base64编码辅助
   * @param str
   * @returns {string}
   */
  encodeAdd(str:string):string {
    var newStr = str.replace(/\+/g, "%2B");
    return newStr;
  }

  /**
   * 失败报错
   * @param subTitle
     */
  failError(subTitle: string) {
    this.alertCtrl.create({
      title: "失败",
      subTitle: subTitle,
      buttons: ["关闭"]
    }).present();
  }

  /**
   * 修改图片为安全URL
   * @param image
   */
  safeImage(image: String) : SafeUrl{
    return this.sanitize.bypassSecurityTrustUrl("data:image/jpg;base64," + image)
  }

}
