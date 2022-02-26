import { FileUploader } from "react-drag-drop-files";
import styles from './upload-section.module.css';
import FileUploadIcon from '../img/file-upload-icon.svg';
import React from "react";

function UploadPromptNoFile({ hover }: {hover: boolean}) {
    return <div className={styles.addFile}>
        <div className={styles.folderLogo + " mb-4"}>
            <img src={FileUploadIcon}/>
        </div>
        <p className="fw-bold fs-5">
        {hover ? 
            "Release here to add file" :
            "Drag or add your files from your local folders"
        }
        </p>
    </div>;
}

function UploadPromptHover() {
    return <div className={styles.addFile}>
        <div className={styles.folderLogo + " mb-4"}>
            <img src={FileUploadIcon}/>
        </div>
        <p className="fw-bold fs-5">Drop Files here</p>
    </div>;
}


export default function UploadSection() {
    const [ hover, setHover ] = React.useState(false);
    const [ file_list, setFileList ] = React.useState<undefined | File[]>();
    return <div className={styles.uploadToolWrapper + " container"}>
        <FileUploader multiple onDraggingStateChange={setHover}>
            <div className={styles.uploadSection}>
                <UploadPromptNoFile hover={hover}/>
            </div>
        </FileUploader>
    </div>;
}