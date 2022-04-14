import styles from './files-page.module.css';
import { Container, Nav } from 'react-bootstrap';
import { FilesSection } from "./FilesSection";
import UploadPageNav from "../../UploadPage/UploadPageNav";

export function FilesPage() {
  return <div id={styles.filesPage} className="py-4">
    <Container className="mt-3 mb-5 flex-grow-1 d-flex">
      <FilesSection/>
    </Container>
  </div>
}