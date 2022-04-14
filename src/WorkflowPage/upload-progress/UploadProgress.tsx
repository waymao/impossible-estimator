import { FileUploadInfo } from "../files";
import styles from './upload-progress.module.css';

export default function UploadProgress({info}: {info: FileUploadInfo}) {
    return <div className={styles.uploadProgress}>
        <span>{info.file.name}</span>
        <span>{info.file.size}</span>
        <span>{`${info.upload_progress * 100}%`}</span>
    </div>
}
