import { useState } from "react";
import { NumberLiteralType } from "typescript";
import { API_HOST } from '../config';
import { FILE_HOST } from '../config';
import { getCookieByName } from '../UploadPage/csrf';

const FILE_STATIC_PATH = "/uploads/"
const FILE_INFO_PATH = "/file/all"
const FILE_UPLOAD_PATH = API_HOST + "/file/upload"
const TRANSFORM_PATH = "/transform/"
// TODO changeme??

export interface FileInfo {
    id: number,
    name: string,
    path: string,
    hash: string
}

export async function getFileInfo(id: string | number): Promise<FileInfo | null> {
    const res = await fetch(API_HOST + FILE_INFO_PATH + "?id=" + id);
    const result: FileInfo[] = await res.json();
    if (result.length <= 0) {
        return null;
    }
    const info: FileInfo = result[0];
    console.log(info);
    info.path = API_HOST + FILE_STATIC_PATH + info.path;
    console.log(info);
    return info;
}

export async function getFilesInfo(): Promise<Array<FileInfo> | null> {
    const res = await fetch(API_HOST + FILE_INFO_PATH);
    const results: FileInfo[] = await res.json();
    if (results.length <= 0) {
        return null;
    }
    return results;
}

export function useFileListUpload(files: File[]): [number, number[], () => Promise<any>, any[]] {
    const [ upload_progress, setUploadProgress ] = useState(new Array(files.length).fill(0));
    const [ errors, setErrors ] = useState<any[]>(new Array(files.length).fill(null).map(() => ""));
    if (files.length === 0) {
        return [0, [], async () => {}, []];
    }
    const file_count = files.length;

    const uploadNextFile = async (file_index: number) => {
        if (file_index > file_count) {
            return "success";
        }
        const updateProgressForFile = (progress: number) => {
            upload_progress[file_index] = progress;
            setUploadProgress([ ...upload_progress ]);
        }
        const reportErrorForFile = (error: any) => {
            errors[file_index] = error;
            setErrors([ ...errors]);
        }
        try {
            await uploadOneFile(files[file_index], updateProgressForFile);
        } catch (e) {
            reportErrorForFile(e);
        }
        await uploadNextFile(file_index + 1);
    };

    const beginUpload = async () => {
        return await uploadNextFile(0);
    };

    const computeTotalProgress = upload_progress.reduce((sum, curr) => sum + curr, 0) / file_count;

    return [ computeTotalProgress, upload_progress, beginUpload, errors ];
}

/* useFileUpload
 * react hook to upload file
 * calling beginUpload twice will cause the file to be uploaded twice
 * params:
 *     - file: File the file to be uploaded
 * outputs:
 *     - upload_progress: number, progress
 *     - beginUpload: function to begin upload
 */
export function useFileUpload(file: File) {
    // using xhr so we know upload progress
    const [ upload_progress, setUploadProgress ] = useState(0);

    const beginUpload = () => {
        return uploadOneFile(file, setUploadProgress);
    }
    return [ upload_progress, beginUpload ] as [number, () => Promise<void>];
}

export function uploadOneFile(file: File, setUploadProgress?: (progress: number) => void) {
    const filename = file.name;
    const data = new FormData();
    const csrftoken = getCookieByName('csrftoken');
    data.append('file', file);
    data.append('filename', filename);
    const xhr = new XMLHttpRequest();
    if (setUploadProgress) setUploadProgress(0);

    return new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
            console.log("upload progress:", event.loaded / event.total);
            if (setUploadProgress) setUploadProgress(event.loaded / event.total);
        }
        });
        xhr.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
            console.log("download progress:", event.loaded / event.total);
            if (setUploadProgress) setUploadProgress(event.loaded / event.total);
        }
        });
        xhr.addEventListener("loadend", () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (setUploadProgress) setUploadProgress(1);
                resolve(JSON.parse(xhr.responseText) as File);
            } else {
                reject("Load failed")
            }
        });
        xhr.open("POST", FILE_UPLOAD_PATH, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.send(data);
    });
}

export interface FileUploadInfo {
    file: File,
    upload_progress: number,
    file_url: null | string
}

export function makeFileUploadInfo(file: File) {
    return {
        file,
        upload_progress: 0,
        file_url: null
    } as FileUploadInfo;
}

export function downloadFileCSV(file_name: string, file_id: number) {
    console.log(file_id);
    fetch(
        `${API_HOST}${TRANSFORM_PATH}retrieve-csv/${file_id}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'text/csv; charset=UTF-8',
          },
        }
      )
      .then(async (res) => {
        var blob = await res.blob();
        var a = document.createElement("a");
        document.body.appendChild(a);
        var file = window.URL.createObjectURL(blob);
        a.href = file;
        a.download = file_name.slice(0, -4) + '-processed.csv';
        a.click();
        window.URL.revokeObjectURL(file);
        // window.location.assign(file);
      });
}