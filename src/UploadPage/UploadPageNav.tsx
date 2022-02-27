import styles from './upload-page.module.css';
import LogoWhite from '../img/PB-white.svg';

export default function UploadPageNav() {
    return <nav className="mx-2 mx-md-5 d-flex flex-col align-items-center">
        <img src={LogoWhite} alt="logo" className={styles.logo}/>
        <h1 className="text-white mx-3 fs-3 fw-bold">ESG Fund Analysis</h1>
    </nav> 
}