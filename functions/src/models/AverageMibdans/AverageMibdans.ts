


export interface Report {
    title: string;
    typeId: number;
    avgDifficulty: number;
    avgTotalRowPoints: number;
}

export interface Mibdans {
    typeId: number;
    title: string;
    report: Report[];
}

export interface AverageMibdans {
    className: string;
    classTypeId: number;
    data: Mibdans[];
}

