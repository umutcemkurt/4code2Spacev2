import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { schools as schoolData , teams as teamsData } from 'app/mock-api/schools/data';

@Injectable({
    providedIn: 'root'
})
export class SchoolsMockApi {
    private _schools: any[] = schoolData;
    private _teams: any[] = teamsData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Activities - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/GetSchools')
            .reply(() => [200, cloneDeep(this._schools)]);

        this._fuseMockApiService
            .onGet('api/GetTeams')
            .reply(({request}) => {

              //  debugger
                const id = request.params.get('schoolId');
                
                let teams =   this._teams.filter(t => t.schoolId == id)

                return [200 , teams]
            });

    }
}
