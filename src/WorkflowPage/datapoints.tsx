const API_HOST = "http://localhost:8000";

export interface ProcessedDataPoint {
    page: number,
    content: string,
    coord: [number, number, number, number]
    stat: number,
    stat_coord: [number, number, number, number]
}

export interface TransformResult {
    result: {
        id: number,
        name: string,
        processed_datas: ProcessedDataPoint[]
    }
}

export async function getDataPoint(filename: string) {
    const response = await fetch(API_HOST + "/transform/retrieve/" + filename);
    const data: TransformResult = await response.json();
    return data;
}
