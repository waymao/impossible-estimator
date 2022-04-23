import React from 'react';
import {
    useLocation
} from 'react-router-dom';
import { FileUploadInfo } from '../files';
import UploadProgress from './UploadProgress';

export default function UploadProgressBoard() {
    const {state } = useLocation();
    if(!state) {
        return <div>ASDF</div>
    }
    const { files } = state as {files: File[]};
    if(files) {
        return <div>
        {files.map(
            (file: File) => <UploadProgress file={file}/>)}
        </div>
    }else {
        return <div>
            no
        </div>
    }

}
