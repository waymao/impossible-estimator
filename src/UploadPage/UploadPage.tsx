import styles from './upload-page.module.css';
import UploadPageNav from './UploadPageNav';
import UploadSection from './UploadSection';
import UploadMetricModal from './UploadMetricModal';
import {useState} from 'react';
import { Button, Modal } from 'react-bootstrap';

export function UploadPage() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return <div id={styles.uploadPage} className="py-4">
        <UploadPageNav/>
        <div className="row">
            <div className="col d-flex justify-content-center">
                <p className="container text-white fw-bold fs-3 lh-1 my-5">
                    🧐 Analyzing ESG 📄 should be like making an 🥧
                    -- it should be easy.
                </p>
            </div>

            <div className="col justify-content-md-end gap-2 d-md-flex">
                <button id={styles.button} type="button" className="container btn btn-primary fw-bold text-white fs-3 lh-1 my-5 w-50 me-md-2 " onClick={handleShow}> Metric List </button>

            </div>

        </div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body><UploadMetricModal></UploadMetricModal></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
        <UploadSection/>
        <footer className="text-center text-white mt-5">Powered by Team Pacific Blue</footer>
    </div>
}
