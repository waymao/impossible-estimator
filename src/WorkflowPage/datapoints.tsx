import { API_HOST } from '../config';

export interface ProcessedDataPoint {
    id: number,
    page: number,
    content: string,
    coord: [number, number, number, number]
    stat: number,
    stat_coord: [number, number, number, number]
}

export interface DataOnBox {
    id: number,
    page: number,
    stat: string,
    stat_coord: [number, number, number, number]
}

export interface TransformResult {
    id: number,
    name: string,
    processed_datas: ProcessedDataPoint[]
}


export async function getExtractedDataPoint(file_id: string) {
    // TODO does not work yet
    const response = await fetch(API_HOST + "/extract/retrieve-data/" + file_id);
    const data: TransformResult = await response.json();
    return data;
}


export async function getTransformedDataPoint(file_id: string) {
    const response = await fetch(API_HOST + "/transform/retrieve-data/" + file_id);
    const data: TransformResult = await response.json();
    return data;
}
