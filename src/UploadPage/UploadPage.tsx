import styles from './upload-page.module.css';
import UploadPageNav from './UploadPageNav';
import UploadSection from './UploadSection';

export function UploadPage() {
    return <div id={styles.uploadPage} className="py-4">
        <UploadPageNav/>
        <p className="container text-white fw-bold fs-3 lh-1 my-5">
            🧐 Analyzing ESG 📄 should be like making an 🥧
            -- it should be easy.
        </p>
        <UploadSection/>
        <footer className="text-center text-white mt-5">Powered by Team Pacific Blue</footer>
    </div>
}
