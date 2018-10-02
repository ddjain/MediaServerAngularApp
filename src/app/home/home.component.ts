import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig,MatIconRegistry } from '@angular/material';
import {FileInfo} from './FileInfo';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  url:string;
  constructor(public http: HttpClient,public snackBar: MatSnackBar,iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 

    iconRegistry.addSvgIcon(
      'play',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/play.svg'));

  }

  drives:string[]=[];
  files:FileInfo[]=[];
  ngOnInit() {
  this.url=window.location.href;
  this.getDriveList(this.url);  
}
 

  getDriveList(url:string){   
     this.url=url;
    this.http.get(url+'/drives').subscribe(res =>{
      this.drives=res as string[];
    });
  }
  
  getFolders(path:string){
    path=path.replace("\\\\","@");
    path=path.replace("\\","@");
   this.http.get(this.url+'/folders/'+path).subscribe(res =>{
    this.files=[];
     for(let i=0;i<res['length'];i++){
       let file=new FileInfo();
       file.filename=res[i].filename;
       if(res[i].playable){
         //file.path=this.url+"/video.php?path="+res[i].path;
         debugger;
         let path=res[i].path.replace(new RegExp('\\\\','g'),'@');
         file.path=this.url+"/video/"+path;
         
       }
       else{
         file.path=res[i].path;  
       }
       file.playable=res[i].playable;
       this.files.push(file);
     }
     console.log(this.files);

   });
 }





  openSnackBar(message: string, action: string,returnId:number) {
    if(action=='')
       action='Close';
    let snackBarRef = this.snackBar.open(message, action);
    snackBarRef.onAction().subscribe(()=>this.onSnackBarActionButtonClick(returnId))
  }
  onSnackBarActionButtonClick(returnId:number){
   
  }

}
