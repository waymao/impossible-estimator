import { Button } from "react-bootstrap";
import React, {useEffect} from 'react';
import { FileUploadInfo, useFileUpload } from "../files";
import styles from './upload-progress.module.css';

export default function UploadProgress({file, progress}: {file: File, progress: number}) {
    // const [upload_progress, beginUpload] = useFileUpload(file);

    // useEffect(() => {
    //     beginUpload();
    // }, []);

    return <div className={styles.uploadProgress}>
        <span>{file.name}</span>
        <span>{file.size}</span>
        <span>{`${progress}%`}</span>
        {/* <span><Button onClick={beginUpload}>Upload</Button></span> */}
    </div>
}
