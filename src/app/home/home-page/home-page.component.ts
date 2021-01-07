import { Component, OnInit } from '@angular/core';
import {HomeService} from '../home.service';
import {ActivatedRoute} from '@angular/router';
import {VALUES_AR, VALUES_EN} from '../../translation/en';

@Component({
  selector: 'rahba-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public language =  1;
  constructor(public homeService: HomeService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.initPropsFromUrlParams();
  }

  private initPropsFromUrlParams(): void {
    const paramMap = this.activatedRoute.snapshot.paramMap;

    if (paramMap.has('language')) {
      this.language = paramMap.get('language') === 'ar' ? 0 : 1;
    }
  }

  public get values(): any {
    return this.language === 1 ? VALUES_EN : VALUES_AR;
  }
}
