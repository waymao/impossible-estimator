import { API_HOST } from '../config';
import { getCookieByName } from '../UploadPage/csrf';

export interface ProcessedDataPoint {
    id?: number,
    filename: number,
    page: number,
    content: string,
    category: string,
    metric: string,
    sub_metric: string,
    coord: [number, number, number, number],
    stat: string,
    ref_sub?: number,
    ref_num?: number | null,
    stat_coord: [number, number, number, number],
    is_validated: boolean
}

export interface ProcessedDPUpdateReq extends ProcessedDataPoint {
    override?: boolean
}

export interface RawDataPoint {
    id: number,
    filename: number,
    page: number,
    type: "NUM" | "STR",
    content: string,
    coord: [number, number, number, number]
}

export interface TransformResult {
    id: number,
    name: string,
    hash: string,
    processed_datas: ProcessedDataPoint[]
}

export interface ExtractResult {
    id: number,
    name: string,
    hash: string,
    raw_data: RawDataPoint[]
}

export async function getExtractedDataPoint(file_id: string) {
    // TODO does not work yet
    const response = await fetch(API_HOST + "/extract/retrieve-data/" + file_id);
    const data: ExtractResult = await response.json();
    return data;
}


export async function getTransformedDataPoint(file_id: string) {
    const response = await fetch(API_HOST + "/transform/files/" + file_id);
    const data: TransformResult = await response.json();
    return data;
}

export type UpdateDPResult = {
    data: ProcessedDataPoint,
    new_data: true,
    old_id?: null
} | {
    data: ProcessedDataPoint,
    new_data: false,
    old_id: number
}

export async function newTransformedDataPoint(data_point: ProcessedDPUpdateReq): Promise<UpdateDPResult> {
    const csrftoken = getCookieByName('csrftoken');
    const response = await fetch(API_HOST + "/transform/data/new", {
        method: 'PUT',
        headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data_point)
    });
    if (Math.floor(response.status / 100) === 2) {
        return response.json();
    } else {
        throw new Error("Failed to create new data point.")
    }
}

export async function changeValidationStatus(id: number, is_validated: boolean) {
    const csrftoken = getCookieByName('csrftoken');
    const response = await fetch(API_HOST + `/transform/data/${id}`, {
        method: 'PATCH',
        headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ is_validated })
    });
    if (Math.floor(response.status / 100) === 2) {
        return response.json();
    } else {
        throw new Error("Failed to create new data point.")
    }
}

export async function manualAssignCategory(id: number, category?: string, metric?: string, sub_metric?: string) {
    const csrftoken = getCookieByName('csrftoken');
    const response = await fetch(API_HOST + `/transform/data/${id}`, {
        method: 'PATCH',
        headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ category, metric, sub_metric })
    });
    if (Math.floor(response.status / 100) === 2) {
        return response.json();
    } else {
        throw new Error("Failed to create new data point.")
    }
}