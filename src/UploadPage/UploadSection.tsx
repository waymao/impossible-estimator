import { useDropzone } from 'react-dropzone';
import { UploadFileList } from './UploadFileList';
import styles from './upload-section.module.css';
import FileUploadIcon from '../img/file-upload-icon.svg';
import React from "react";

function UploadPromptNoFile({ hover }: {hover: boolean}) {
    return <div className={styles.addFile + " " + styles.mainUploadBox}>
        <div className={styles.folderLogo + " mb-4"}>
            <img src={FileUploadIcon} alt="logo"/>
        </div>
        <p className="fw-bold fs-5">
        {hover ? 
            "Release here to add file" :
            "Drag or add your files from your local folders"
        }
        </p>
    </div>;
}


export default function UploadSection() {
    const [ file_list, setFileList ] = React.useState<Map<string, File>>(new Map());

    const handleAddFile = (files: File[]) => {
        const new_file_list = new Map(file_list);
        for (const file of files) {
            new_file_list.set(file.name + file.size.toString(), file);
        }
        setFileList(new_file_list);
    };
    const handleDeleteFile = (file: File) => {
        const new_file_list = new Map(file_list);
        new_file_list.delete(file.name + file.size.toString());
        setFileList(new_file_list);
    }

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        onDrop: handleAddFile, noClick: file_list.size !== 0
    });

    return <div className={styles.uploadToolWrapper + " container position-relative px-0 d-flex"}>
        <div className="position-absolute w-100 h-100 d-flex px-2">
        <div {...getRootProps({className: "flex-grow-1 d-flex position-relative " + (file_list.size !== 0 ? styles.cursorDefault : "")})}>
            <input {...getInputProps()}/>
            <div className={styles.uploadSectionBorder}>
                {file_list.size === 0 ?
                    <UploadPromptNoFile hover={isDragActive}/> :
                    <UploadFileList file_list={file_list} handleDeleteFile={handleDeleteFile} openFileDialogue={open}/>}
            </div>
            {isDragActive && 
                <div className={styles.dropLayOver}>
                    {file_list.size === 0 ? "Drop here..." : "Drop to add..."}
                </div>
            }
        </div>
        </div>
    </div>;
}
