import { Container, Nav } from 'react-bootstrap';
import styles from './download-page.module.css';
import { DownloadSection } from './DownloadSection';

export function DownloadPage() {
    return <div id={styles.downloadPage} className="py-4">
        <Container className="mt-3 mb-5 flex-grow-1 d-flex">
            <DownloadSection/>
        </Container>
    </div>
}