import styles from './upload-filelist.module.css';
import section_styles from './upload-section.module.css';
import FolderIcon from '../img/file-upload-icon.svg';
import { ReactComponent as DeleteIcon } from '../img/delete-x-icon.svg';
import { Button } from 'react-bootstrap';
import { getCookieByName } from './csrf';
import { useNavigate } from 'react-router-dom';
import { useFileUpload } from '../WorkflowPage/files';

const UPLOAD_HOST = "http://127.0.01:8000/file/upload";

function FileItem({ file, deleteFile }: {file: File, deleteFile: (file: File) => void}) {
    return <div className={styles.oneFile}>
        <span>{file.name}</span>
        <button 
            className={styles.removeStyle + " ms-auto " + styles.icoButton} 
            onClick={() => deleteFile(file)}
        >
            <DeleteIcon/>
        </button>
    </div>
}

interface UploadFileListProps {
    file_list: Map<string, File>, 
    handleDeleteFile: (file: File) => void,
    openFileDialogue: () => void,
};

export function UploadFileList({ file_list, handleDeleteFile, openFileDialogue }: UploadFileListProps) {
    const navigate = useNavigate();
    
    const convertFileList = () => {
        return Array.from(file_list.values());
    };
    return <div className={section_styles.mainUploadBox + " " + styles.uploadFileListPanel}>
        <h4 className="fs-5 d-flex flex-row align-items-center">
            <img src={FolderIcon} alt="folder icon" style={{width: "1.5rem"}}/>
            <span className="mx-2 fw-bold">{file_list.size === 1 ? "File Selected" : "Files Selected"}</span>
            <Button 
                className={styles.secondaryButton + " ms-auto addmore-btn " + styles.uploadButton}
                variant="light"
                onClick={openFileDialogue}
            >
                Add more
            </Button>
        </h4>
        <div className={styles.uploadFileList}>
            {[...file_list].map(([filename, file]: [string, File]) => <FileItem key={filename} file={file} deleteFile={handleDeleteFile}/>)}
        </div>
        <div className="d-flex flex-row mt-auto">
            <Button className={styles.uploadButton + " mt-2"} onClick={() => {navigate('/process/upload/', { state: { files: convertFileList()} });}}>Proceed to upload</Button>
        </div>
    </div>;
}
