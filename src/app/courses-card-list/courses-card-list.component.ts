import { Component, Input } from '@angular/core';
import { Course } from '../model/course';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.css'
})
export class CoursesCardListComponent {

  // Takes input of courses
  @Input()
  courses:Course[] = [];

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

  }

}
