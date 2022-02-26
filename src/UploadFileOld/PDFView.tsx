import React from "react";
import { DetectPage } from "./DetectInfo";

interface Props {
    file: File,
    info: DetectPage
}



export default function PDFView({file, info}: Props) {
    const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
    const image = React.useMemo(() => {return 1}, []);
    return <canvas ref={canvas_ref}>
        
    </canvas>
}