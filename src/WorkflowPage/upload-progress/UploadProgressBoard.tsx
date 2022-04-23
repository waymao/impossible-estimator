import React, { useEffect } from 'react';
import {
    useLocation
} from 'react-router-dom';
import { FileUploadInfo, useFileListUpload } from '../files';
import UploadProgress from './UploadProgress';

export default function UploadProgressBoard() {
    const {state } = useLocation();
    useEffect(() => {
        beginUpload();
    }, []);

    const { files } = state as {files: File[]};
    const [total_progress, upload_progress, beginUpload, errors] = useFileListUpload(files);

    if(files) {
        return <div>
            <p>{`${Math.round(total_progress*1000)/10}%`} percent done</p>
            {files.map(
                (file: File, index: number) => <UploadProgress key={index} file={file} progress={upload_progress[index]}/>)}
        </div>
    }else {
        return <div>
            no
        </div>
    }

}
