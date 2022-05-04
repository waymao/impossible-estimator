import list_styles from './files-filelist.module.css';
import styles from './files-section.module.css';
import React, { useEffect } from "react";
import { FileInfo, getFilesInfo, requestProcess } from "../files";
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function FileItem({info}: {info: FileInfo}) {
  return <div className={list_styles.oneFile}>
    <span className="me-2">{info.id}.</span>
    <span>{info.name}</span>
    <Button variant="secodary" onClick={() => requestProcess(info.id)} className="ms-auto">
      Run Auto-search
    </Button>
    <Link to={"/process/analyze/" + info.id} className={styles.removeStyle + " ms-2 " + styles.icoButton}>
      <Button> Validate </Button>
    </Link>
  </div>
}

export function FilesSection() {
  const [ filesInfo, setFilesInfo ] = React.useState< FileInfo[] | null>();

  useEffect(() => {
    getFilesInfo().then(setFilesInfo);
  }, []);

  return <div className={styles.uploadToolWrapper}>
    <div className={styles.uploadSectionBorder}>
      <div className={styles.mainUploadBox + " " + list_styles.uploadFileListPanel}>
      <h4 className="fs-5 d-flex flex-row align-items-center">
        <span className="mx-2 fw-bold">Uploaded Files</span>
      </h4>
      <div className={styles.uploadFileList}>
        {filesInfo?.map(f => <FileItem key={f.id} info={f}></FileItem>)}
      </div>
    </div>
    </div>
  </div>;
}