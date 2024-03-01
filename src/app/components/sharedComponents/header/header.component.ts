import { SharedService } from 'src/app/services/sharedService/shared.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
headerInfo: any;
  constructor(private sharedService: SharedService){}
  ngOnInit(): void {
   
    this.sharedService.headerInfo$.subscribe((headerInfo) => {this.headerInfo = headerInfo;})

  

}


}
