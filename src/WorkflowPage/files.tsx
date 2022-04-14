import { useState } from "react";
import { API_HOST } from '../config';
import { FILE_HOST } from '../config';
import { getCookieByName } from '../UploadPage/csrf';

const FILE_STATIC_PATH = "/uploads/"
const FILE_INFO_PATH = "/file/all"
const FILE_UPLOAD_PATH = API_HOST + "/file/upload"
const EXTRACT_EXTRACT_PATH = "/transform/"
// TODO changeme??

export interface FileInfo {
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
        const filename = file.name;
        const data = new FormData();
        const csrftoken = getCookieByName('csrftoken');
        data.append('file', file);
        data.append('filename', filename);
        const xhr = new XMLHttpRequest();
        setUploadProgress(0);

        return new Promise((resolve, reject) => {
            xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                console.log("upload progress:", event.loaded / event.total);
                setUploadProgress(event.loaded / event.total);
            }
            });
            xhr.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                console.log("download progress:", event.loaded / event.total);
                setUploadProgress(event.loaded / event.total);
            }
            });
            xhr.addEventListener("loadend", () => {
                setUploadProgress(100);
                if (xhr.readyState === 4 && xhr.status === 200) {
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
    };

    return [ upload_progress, beginUpload ] as [number, () => Promise<void>];
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
