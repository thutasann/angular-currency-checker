import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss']
})
export class CoinListComponent implements OnInit {

  bannerData: any =[];
  
  // Mat Table
  // https://material.angular.io/components/table/examples
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // for displaying columns
  displayedColumns: string[] = ['symbol', 'current_price', 'price_change_percentage_24h', 'market_cap'];

  // For selected currency
  currency: any = "INR";

  // https://stackoverflow.com/questions/60801513/angular-9-error-ng2003-no-suitable-injection-token-for-parameter-url-of-cla
  constructor(private api: ApiService, private router: Router, private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.getAlldata();
    this.getBannerData();
    // for selecting currency
    this.currencyService.getCurrency().subscribe(val => {
      this.currency = val;
      this.getAlldata();
      this.getBannerData();
    })
  }

  // Banner Data
  getBannerData(){
    this.api.getTrendingCurrency(this.currency).subscribe(res => {
      this.bannerData = res;
    });
  }

  // All data table
  getAlldata(){
    this.api.getCurrency(this.currency)
    .subscribe(res =>{
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  // Filtering
  // https://material.angular.io/components/table/examples
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // View Detail
  gotoDetail(row: any){
    this.router.navigate(['coin-detail',row.id])
  }


}
