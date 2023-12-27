import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
    // Limits to singleton
    providedIn: 'root'
})
export class CoursesService {

    // Constructor for service, private http client
    constructor(private http:HttpClient){

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
}