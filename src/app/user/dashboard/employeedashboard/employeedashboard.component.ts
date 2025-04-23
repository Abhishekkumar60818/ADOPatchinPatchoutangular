import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employeedashboard',
  imports: [RouterModule,CommonModule],
  templateUrl: './employeedashboard.component.html',
  styles: ``
})
export class EmployeedashboardComponent implements OnInit{
  isSmallScreen = false;
  showSidebar = true;

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
    this.showSidebar = !this.isSmallScreen; 
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  onNavItemClick() {
    if (this.isSmallScreen) {
      this.showSidebar = false;
    }

  
  }
}
