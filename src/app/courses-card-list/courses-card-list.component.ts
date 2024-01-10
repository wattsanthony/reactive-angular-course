import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Course } from '../model/course';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Only update when pushed
})
export class CoursesCardListComponent {

  // Takes input of courses
  @Input()
  courses:Course[] = [];

  // Outputs
  @Output()
  private coursesChanged = new EventEmitter();

  // Constructor with material dialog
  constructor(private dialog: MatDialog){

  }
  
  // Edits course function
  editCourse(course: Course) {

    // Setup material dialog config
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    // Open dialog box
    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    // After closed, emit
    dialogRef.afterClosed().pipe(
      filter(val => !!val), // If value occurs
      tap(() => this.coursesChanged.emit())
    ).subscribe();

  }

}
