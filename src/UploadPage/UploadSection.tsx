import { FileUploader } from "react-drag-drop-files";
import { useDropzone } from 'react-dropzone';
import { UploadFileList } from './UploadFileList';
import styles from './upload-section.module.css';
import FileUploadIcon from '../img/file-upload-icon.svg';
import React from "react";

function UploadPromptNoFile({ hover }: {hover: boolean}) {
    return <div className={styles.addFile + " " + styles.mainUploadBox}>
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


export default function UploadSection() {
    const [ hover, setHover ] = React.useState(false);
    const [ file_list, setFileList ] = React.useState<Map<string, File>>(new Map());
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    // used for activating label. not the best practice.
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const openFileDialogue = React.useCallback(() => {
        const labelRef = wrapperRef.current?.getElementsByTagName('label')?.[0];
        console.log(labelRef);
        if (!!labelRef) {
            labelRef.click();
        }
    }, [wrapperRef]);

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

    const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
        console.log(e.target);
        console.log(e.currentTarget);
        console.log((e.target as any).className.indexOf("addmore-btn"));
        const is_file_input = e.target instanceof HTMLInputElement && e.target.type === "file"
        const is_custom_button = e.target instanceof HTMLElement && 
                                e.target.className.indexOf("addmore-btn") !== -1;
        if (is_file_input) {
            return;
        } else if (is_custom_button) {
            e.stopPropagation();
        } else if (file_list.size !== 0) 
        {
            console.log("prevented")
            e.preventDefault();
        }
    }

    return <div className={styles.uploadToolWrapper + " container"} ref={wrapperRef} onClick={handleOnClick}>
        <FileUploader multiple onDraggingStateChange={setHover} handleChange={handleAddFile}>
            <div className={styles.uploadSectionBorder}>
                {file_list.size === 0 ?
                    <UploadPromptNoFile hover={hover}/> :
                    <UploadFileList file_list={file_list} handleDeleteFile={handleDeleteFile} openFileDialogue={openFileDialogue}/>}
            </div>
        </FileUploader>
    </div>;
}