import {
    Routes,
    Route,
} from "react-router-dom";
import styles from './workflow-page.module.css';
import { Container, Nav } from 'react-bootstrap';
import { PreviewPage } from './PreviewPage';

export default function WorkflowPage() {
    return <div className={styles.workflowPage}>
        <Nav
            activeKey="/process"
            className="mx-2 justify-content-center py-4"
            onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
            <Nav.Item>
                <Nav.Link>Upload</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/process">Analyze</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link>Download</Nav.Link>
            </Nav.Item>
        </Nav>
        <Container className="mt-3 mb-5 flex-grow-1 d-flex">
            <Routes>
                <Route path='/analyze/:filename' element={<PreviewPage />}/>
            </Routes>
        </Container>
    </div>;
}