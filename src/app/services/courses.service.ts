import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Lesson } from "../model/lesson";

@Injectable({
    // Limits to singleton
    providedIn: 'root'
})
export class CoursesService {

    // Constructor for service, private http client
    constructor(private http:HttpClient){

    }

    // Loads a course by id
    loadCoursesById(courseId:number):Observable<Course>{
        // Returns the courses with that Id
        return this.http.get<Course>(`/api/courses/${courseId}`)
        .pipe(
            shareReplay()
        );
    }

    // Loads all course lessons
    loadAllCourseLessons(courseId:number):Observable<Lesson[]>{
        // Return lessons array for given courseId
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                pageSize: "10000",
                courseId: courseId.toString()
            }
        }).pipe(// Pipe to map
        map(
            // Mapping function to grab payload
            // so it can convert to Course[]
            response => response['payload']
        ),
        // Pipe to shareReplay (reuse this instead
        // of making multiple http requests)
        shareReplay()
        );
    }

    // Returns an observable of course array
    loadAllCourses():Observable<Course[]>{

        // Return the api call of course array
        return this.http.get<Course[]>('/api/courses').pipe(
            // Pipe to map
            map(
                // Mapping function to grab payload
                // so it can convert to Course[]
                response => response['payload']
            ),
            // Pipe to shareReplay (reuse this instead
            // of making multiple http requests)
            shareReplay()
        );
    }

    // Sends changes to the api
    saveCourse(courseId:string, changes:Partial<Course>):Observable<any>{
        // Return put request to api with changes
        return this.http.put(`/api/courses/${courseId}`, changes).pipe(
            // Pipe to shareReplay to reuse http instance
            shareReplay()
        )
    }

    // Searches lessons via api
    searchLessons(search:string):Observable<Lesson[]>{
        // Http get request
        return this.http.get<Lesson[]>("/api/lessons", {
            // Parameters for search filter and page size
            params: {
                filter: search,
                pageSize: "100"
            }
        }).pipe(
            // Map from payload
            map(res => res["payload"]),
            // Reuse this http request
            shareReplay()
        );
    }
}