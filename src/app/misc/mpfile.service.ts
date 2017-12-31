import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class MpFileService {
    constructor(private http: HttpClient) {}

    getFile(path) {
        this.http.get(path, {responseType: 'json'}).subscribe(data=>{
            console.log(data);
        });
    }
}
