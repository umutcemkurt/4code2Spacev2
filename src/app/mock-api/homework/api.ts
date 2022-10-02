import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import {  homeworks } from './data';
import {products} from '../apps/ecommerce/inventory/data';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class HomeworkMockApi
{
    private _homework = homeworks;
    private _products  = products

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Sales - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/GetActiveHomework')
            .reply(() => {
                const now = moment().minute(0).second(0).millisecond(0)
                //now.setHours(0 ,0  ,0)
                //console.log(now)
                //console.log(homeworks)
                //console.log('----------')

                let homeworkData = this._homework.filter(t => t.deadline.isSameOrAfter(now))
                //console.log(homeworkData)


                homeworkData.map((t) => {

                    t['advisorName'] = this._products.find(x => x.id  = t.advisor_id ).teacher

                    return t

                })
               

            //    const returnData = cloneDeep(homeworkData)

            //     //console.log(returnData)

                
                
            return    [200, cloneDeep(homeworkData)]
            
            });

            this._fuseMockApiService.onGet("api/GetComplatedHomeworks")
                                    .reply(() =>{
                                        const now = moment().minute(0).second(0).millisecond(0)
                                        //now.setHours(0 ,0  ,0)
                                        //console.log(now)
                                        //console.log(homeworks)
                                        //console.log('----------')
                        
                                        let homeworkData = this._homework.filter(t => t.deadline.isBefore(now))
                                        //console.log(homeworkData)
                        
                        
                                        homeworkData.map((t) => {
                        
                                            t['advisorName'] = this._products.find(x => x.id  = t.advisor_id ).teacher
                        
                                            return t
                        
                                        })

                                        return    [200, cloneDeep(homeworkData)]
                                    })
    }
}
