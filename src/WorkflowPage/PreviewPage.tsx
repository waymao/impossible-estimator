import styles from './PreviewPage.module.css';
import PDFViewer from '../UploadPage/PDFViewer';

export function PreviewPage() {
    return <div className={styles.previewPageBoard}>
        <div className={styles.ListPanel}>
            google_2021_diversity_annual_report
        </div>
        <div>
            <PDFViewer url="/google_2021_diversity_annual_report.pdf"/>
        </div>
    </div>;
}
