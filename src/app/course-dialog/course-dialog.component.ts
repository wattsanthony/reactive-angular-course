import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [LoadingService,
                MessagesService] // Must be provided to use without crash
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private coursesService:CoursesService,
        private loadingService:LoadingService,
        private messageService:MessagesService) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngAfterViewInit() {

    }

    // Save function
    save() {

      // Get form values for changes
      const changes = this.form.value;

      // Run save courses and also make observable from
      const saveCourse$ = this.coursesService.saveCourse(this.course.id, changes).pipe(
        // Catch errors
        catchError(err => {
            // Log to console
            const message = "Could not save course.";
            console.log(message, err);

            // Send to message service
            this.messageService.showErrors(message);

            // Throw error to end observable chain
            return throwError(err);
        })
      );

      // Send to loading service and subscribe to close on finish
      this.loadingService.showLoaderUntilCompleted(saveCourse$).subscribe(
        // Send value as close reference
        val => {
            this.dialogRef.close(val);
        }
      );

    }

    // Close function
    close() {
        // Does not send reference
        this.dialogRef.close();
    }

}
