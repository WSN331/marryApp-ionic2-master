/**
 * Created by ASUS on 2017/9/7 0007.
 */
import {Injectable} from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AlertController } from 'ionic-angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImagePicker } from '@ionic-native/image-picker';

@Injectable()
export class ImgService {

  /**
   * 相机参数
   * @type {{quality: number, destinationType: number, encodingType: number, mediaType: number}}
     */
  private cameraOptions: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 100,
    targetHeight: 100
  }

  /**
   * 相册参数
   * @type {{maximumImagesCount: number, width: number, height: number, quality: number, outputType: number}}
     */
  private pickerOptions = {
    maximumImagesCount: 1,
    width: 500,//图片的宽度
    height: 500,//图片的高度
    quality: 50,//图片的质量0-100之间选择
    outputType: 1 // default .FILE_URI返回影像档的，0表示FILE_URI返回影像档的也是默认的，1表示返回base64格式的图片
  }

  constructor(private camera: Camera, public alertCtrl: AlertController, private sanitize:DomSanitizer, private imagePicker: ImagePicker) {
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
      this.failError("调用相机失败");
    });
  }

  /**
   * 调用相册
   * @param success
     */
  startPicker(success: Function) {
    this.imagePicker.getPictures(this.pickerOptions).then((results) => {
      if(results.length>0) {
        success(this.encodeAdd(results[0]));
      }
    }, (err) => {
      console.log(err);
      this.failError("调用相册失败");
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
