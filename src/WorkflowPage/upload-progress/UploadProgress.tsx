import { Button } from "react-bootstrap";
import { FileUploadInfo, useFileUpload } from "../files";
import styles from './upload-progress.module.css';

export default function UploadProgress({file}: {file: File}) {
    const [upload_progress, beginUpload] = useFileUpload(file);
    return <div className={styles.uploadProgress}>
        <span>{file.name}</span>
        <span>{file.size}</span>
        <span>{`${upload_progress * 100}%`}</span>
        <span><Button onClick={beginUpload}>Upload</Button></span>
    </div>
}
