import {
    Routes,
    Route,
} from "react-router-dom";
import styles from './workflow-page.module.css';
import { Container, Nav } from 'react-bootstrap';
import { PreviewPage } from './preview-page/PreviewPage';
import UploadProgressBoard from "./upload-progress/UploadProgressBoard";
import { FilesPage } from "./files-page/FilesPage";
import { DownloadPage } from "./download-page/DownloadPage";

export default function WorkflowPage() {
    return <div className={styles.workflowPage}>
        <Nav
            activeKey="/process"
            className="mx-2 justify-content-center py-4"
        >
            <Nav.Item>
                <Nav.Link href="/">Upload</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/process/files">Files</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/process">Analyze</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/process/download">Download</Nav.Link>
            </Nav.Item>
        </Nav>
        <Container fluid className="mt-3 mb-5 mx-5 flex-grow-1 d-flex">
            <Routes>
                <Route path='/analyze/:file_id' element={<PreviewPage />}/>
                <Route path='/upload/' element={<UploadProgressBoard />}/>
                <Route path='/files/' element={<FilesPage/>}/>
                <Route path='/download/' element={<DownloadPage/>}/>
            </Routes>
        </Container>
    </div>;
}