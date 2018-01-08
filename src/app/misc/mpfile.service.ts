import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class MpFileService {
    baseUrl = "http://localhost:3000";
    constructor(private http: HttpClient) {}

    getFile(path, callback) {
        this.http.get(path, {responseType: 'json'}).subscribe(data=>{
            callback(data);
        });
    }

    getShapeTemplatesData(callback) {
        let path = this.baseUrl + "/shape-templates.json";
        this.http.get(path, {responseType: 'json'}).subscribe(data=>{
            callback(data);
        });
    }
}
