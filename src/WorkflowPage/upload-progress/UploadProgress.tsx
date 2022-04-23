import { Button } from "react-bootstrap";
import React, {useEffect} from 'react';
import { FileUploadInfo, useFileUpload } from "../files";
import styles from './upload-progress.module.css';

export default function UploadProgress({file}: {file: File}) {
    const [upload_progress, beginUpload] = useFileUpload(file);

    useEffect(() => {
        beginUpload();
    }, []);

    return <div className={styles.uploadProgress}>
        <span>{file.name}</span>
        <span>{file.size}</span>
        <span>{`${upload_progress}%`}</span>
        {/* <span><Button onClick={beginUpload}>Upload</Button></span> */}
    </div>
}
