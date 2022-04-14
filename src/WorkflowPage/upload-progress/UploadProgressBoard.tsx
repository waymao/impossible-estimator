import React from 'react';
import {
    useLocation
} from 'react-router-dom';
import { FileUploadInfo } from '../files';
import UploadProgress from './UploadProgress';

export default function UploadProgressBoard() {
    const { fileList } = useLocation().state as {fileList: FileUploadInfo[]};

    return <div>
        {fileList.map(
            (file: FileUploadInfo) => <UploadProgress info={file}/>)}
    </div>
}
