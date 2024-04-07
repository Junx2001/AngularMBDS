import { Component } from '@angular/core';
import { RenduDirective } from '../shared/rendu.directive';
import { Assignment } from './assignment.model';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { MatButtonModule } from '@angular/material/button';
import { AssignmentsService } from '../shared/assignments.service';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { GlobalService } from '../shared/global.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AssignmentFK } from './assignment_fk.model';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-assignments',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatGridListModule,
    MatIconModule,
    MatPaginatorModule,
    MatCardModule,
    MatTableModule,
    FormsModule,
    MatSliderModule,
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    RenduDirective,
    AssignmentDetailComponent,
    MatListModule,
    CommonModule,
    AddAssignmentComponent,
    MatDatepickerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.css',
})
export class AssignmentsComponent {
  assignements: AssignmentFK[] = [];
  page = 1;
  limit = 8;
  totalDocs!: number;
  totalPages!: number;
  nextPage!: number;
  prevPage!: number;
  hasNextPage!: boolean;
  hasPrevPage!: boolean;
  displayedColumns: string[] = ['nom', 'dateDeRendu', 'rendu'];
  searchKeyword = '';
  searchDateDeRendu = undefined;
  defaultImage = GlobalConstants.defaultImage;


  constructor(
    private assignmentsService: AssignmentsService,
    private globalService: GlobalService,
    private router: Router
  ) {}

  getColorRendu(a: any) {
    return a.rendu ? 'green' : 'red';
  }
  ngOnInit(): void {
    this.getAssignmentFromService();
  }
  getAssignmentFromService() {
    this.globalService.setLoading(true);
    this.assignmentsService
      .getAssignmentsPagines(this.page, this.limit)
      .subscribe((data) => {
        if (data.success) {
          data = data.data;
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
          console.log(this.assignements);
          
        } else {
          this.globalService.openSnackBar(data.error, '', ['danger-snackbar']);
        }
        this.globalService.setLoading(false);
      });
  }
  pagePrecedente() {
    this.page = this.prevPage;
    this.getAssignmentFromService();
  }
  pageSuivante() {
    this.page = this.nextPage;
    this.getAssignmentFromService();
  }
  getAssignmentsFromService() {}
  premierePage() {
    this.page = 1;
    this.getAssignmentFromService();
  }
  dernierePage() {
    this.page = this.totalPages;
    this.getAssignmentFromService();
  }
  handlePageEvent(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getAssignmentFromService();
  }
  navigateDetails(id: String | undefined) {
    this.router.navigate(['assignment', id]);
  }
}
