import { Injectable } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { filter, map, catchError, tap, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
    providedIn: 'root' // Only one instance allowed
})
export class CoursesStore{

    // Subject to emit values
    private subject = new BehaviorSubject<Course[]>([]);

    // Observable of subject
    courses$:Observable<Course[]> = this.subject.asObservable();

    // Constructor
    constructor(
        private http:HttpClient,
        private loadingService:LoadingService,
        private messagesService:MessagesService
        ) {
        this.loadAllCourses();
    }

    // Load only here once
    private loadAllCourses(){
        // Load courses
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
        .pipe(
            // Map to payload
            map(response => response["payload"]),
            // Catch errors
            catchError(err => {
                // Show message of error
                const message = "Could not load courses";
                this.messagesService.showErrors(message);
                // Log to console
                console.log(message, err);
                // Throw error to end observable chain
                return throwError(err);
            }),
            // If no error, save courses recieved via emit
            tap(courses => this.subject.next(courses))
        );

        // Set up loader
        this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
    }

    // Function to save courses
    saveCourse(courseId:string, changes:Partial<Course>):Observable<any>{
        
        // Get list of courses from subject
        const courses = this.subject.getValue();

        // Find index of course
        const index = courses.findIndex(course => course.id === courseId);

        // Make copy of course, use '...' spread to populate from index pos
        // then spread changes to object over existing in copy
        const newCourse: Course = {
            ...courses[index],
            ...changes
        }

        // Slice copy array to new copy
        const newCourses: Course[] = courses.slice();

        // Insert updated course into new courses
        newCourses[index] = newCourse;

        // Emit these so app can use
        this.subject.next(newCourses);
        
        // Send to api to be saved
        return this.http.put(`/api/courses/${courseId}`, changes)
        .pipe(
            // Catch any errors
            catchError(err => {
                // Send messages and end observable chain
                const message = "Course could not be saved";
                console.log(message, err);
                this.messagesService.showErrors(message);
                return throwError(err);
            }),
            // Single use, share with any calls
            shareReplay()
        );
    }

    // Filter function for a given category
    filterByCategory(category:string):Observable<Course[]>{
        // Return observable
        return this.courses$.pipe(
            // Map courses on filter
            map(
                courses => courses.filter(
                    // Filter by category per course
                    course => course.category === category)
                    // Sort using sortCoursesBySeqNo funct
                    .sort(sortCoursesBySeqNo))
        );
    }

}