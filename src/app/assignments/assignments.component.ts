import { Component } from '@angular/core';
import { RenduDirective } from '../shared/rendu.directive';
import { Assignment } from './assignment.model';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { MatButtonModule } from '@angular/material/button';
import { AssignmentsService } from '../shared/assignments.service';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {PageEvent, MatPaginatorModule} from '@angular/material/paginator';
import { GlobalService } from '../shared/global.service';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [ MatGridListModule,MatIconModule, MatPaginatorModule,MatCardModule,MatTableModule,FormsModule,MatSliderModule,RouterOutlet,RouterLink,MatButtonModule,RenduDirective,AssignmentDetailComponent,
    MatListModule,CommonModule, AddAssignmentComponent],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.css'
})
export class AssignmentsComponent {
  assignements: Assignment[] =[]
  page=1;
  limit=9;
  totalDocs!:number;
  totalPages!:number;
  nextPage !:number;
  prevPage !:number;
  hasNextPage!:boolean;
  hasPrevPage!:boolean;
  displayedColumns:string[]=['nom', 'dateDeRendu','rendu'];

  constructor(private assignmentsService:AssignmentsService,
    private globalService : GlobalService,
    private router : Router){}

  public getColorRendu(a:any){
    return a.rendu ? 'green' : 'red';
  }
  getIconRendu(a:any){
    return a.rendu ? 'check' : 'close';
  }
  ngOnInit(): void {
    this.getAssignmentFromService();
  }
  getAssignmentFromService(){
    this.assignmentsService.getAssignmentsPagines(this.page, this.limit)
    .subscribe(
      (data)=>{
        if(data.success){
          data = data.data;
          console.log("Donnees arrivees");
          this.assignements = data.docs;
          this.page = data.page;
          this.limit = data.limit;
          this.totalDocs = data.totalDocs;
          this.totalPages = data.totalPages;
          this.nextPage = data.nextPage;
          this.prevPage = data.prevPage;
          this.hasNextPage = data.hasNextPage;
          this.hasPrevPage = data.hasPrevPage;
          this.globalService.closeSnackBar();
        }else{
          this.globalService.openSnackBar(data.error,'',['danger-snackbar']);
        } 
      
    });
    console.log("Requete envoyee");
  }
  pagePrecedente(){
    this.page = this.prevPage;
    this.getAssignmentFromService();
  }
  pageSuivante(){
    this.page = this.nextPage;
    this.getAssignmentFromService();
  }
  getAssignmentsFromService(){

  }
  premierePage(){
    this.page = 1;
    this.getAssignmentFromService();
  }
  dernierePage(){
    this.page = this.totalPages;
    this.getAssignmentFromService();
  }
  handlePageEvent(event:PageEvent){
    this.page = event.pageIndex+1;
    this.limit = event.pageSize;
    this.getAssignmentFromService();
  }
  navigateDetails(id:String|undefined){
    this.router.navigate(['assignment', id]);
  }
}
