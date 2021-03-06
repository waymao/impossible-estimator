import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// import { pdfjsWorker } from 'pdfjs-dist/build/pdf.worker.entry';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { ProcessedDataPoint } from '../datapoints';
import {useWindowSize} from './viewer-utils';
import styles from './PreviewPage.module.css';

export interface BoxToDraw {
    id: string,
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    color?: string,
    onClick?: () => void,
    href?: string,
    className?: string,
    style?: React.CSSProperties
    children?: React.ReactNode
}

export interface Props {
    url: string, 
    page?: number, 
    boxes_to_draw: BoxToDraw[],
    reportChangePage?: (a: number) => void
}

export default function PDFViewer({url, page, boxes_to_draw, reportChangePage}: Props){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    // console.log(boxes_to_draw);

    // pdf.js document
    const [pdfRef, setPdfRef] = useState<PDFDocumentProxy>();
    // current page
    const [currentPage, setCurrentPage] = useState(1);
    // size of the canvas
    const [canvas_size, setCanvasSize] = useState<[number, number]>([0, 0]);
    const [viewport_s, setViewPort] = useState<pdfjsLib.PageViewport>();
    const [enlarge_ratio, setEnlargeRatio] = useState<number>(1);
    const [initial_container_dim, setInitContainerDim] = React.useState<[number, number]>();
    const [window_width, window_height] = useWindowSize();

    React.useEffect(() => {
        const container = containerRef.current;
        if (container && 
            (!initial_container_dim || 
                initial_container_dim[0] != container.clientWidth - 20 ||
                initial_container_dim[1] != container.clientHeight - 20)) 
                // update initialheight on window resize 
                // TODO bug
        {
            setInitContainerDim([container.clientWidth - 10, container.clientHeight - 10])
        }
    }, [containerRef, window_width, window_height]);

    const renderPage = (pageNum: number, pdf=pdfRef) => {
        const screen_scale = window.devicePixelRatio ?? 1;
        pdf && pdf.getPage(pageNum).then((page: PDFPageProxy) => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (canvas && container) {
                // console.log("file width", page.getViewport({scale: 1}).width);
                // console.log("screen scale", screen_scale);
                // console.log("initial size", initial_container_dim)
                const original_ratio_viewport = page.getViewport({scale: 1});
                const outputScale = Math.min(
                    (initial_container_dim?.[0] ?? 100) / original_ratio_viewport.width,
                    (initial_container_dim?.[1] ?? 100) / original_ratio_viewport.height
                ) * screen_scale * enlarge_ratio;
                const viewport = page.getViewport({ scale: outputScale });
                // console.log("vp:", viewport.width, viewport.height, "; ratio:", outputScale)
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.style.height = viewport.height / screen_scale * enlarge_ratio + "px";
                canvas.style.width = viewport.width / screen_scale * enlarge_ratio + "px";
                setCanvasSize([viewport.width / screen_scale * enlarge_ratio, viewport.height / screen_scale * enlarge_ratio]);

                const context = canvas.getContext('2d');
                if (context !== null) {
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    setViewPort(viewport);
                    page.render(renderContext);
                }
            }
        });
    };

    // effect to render the page using pdf
    useEffect(() => {
        renderPage(currentPage, pdfRef);
    }, [pdfRef, currentPage, enlarge_ratio, window_width]);

    // effect to 
    useEffect(() => {
        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then((loadedPdf: any) => {
        setPdfRef(loadedPdf);
        });
    }, [url]);

    const boxes = React.useMemo(() => {
        if (!viewport_s) return [];
        return boxes_to_draw.map((box: BoxToDraw) => {
            // console.log(box);
            const rect = viewport_s.convertToViewportRectangle([box.x1, box.y2, box.x2, box.y1]) as number[];
            // console.log(rect);
            return <div 
                style={{
                    left: rect[0] / viewport_s.width * canvas_size[0] + 'px',
                    top: rect[1] / viewport_s.height * canvas_size[1] + 'px', // TODO change coord
                    width: (rect[2] - rect[0]) / viewport_s.width * canvas_size[0] + 'px',
                    height: (rect[3] - rect[1]) / viewport_s.height * canvas_size[1] + 'px',
                    border: "1px solid " + box.color ?? "black",
                    position: "absolute",
                    cursor: "pointer",
                    ...box.style
                }}
                onClick={box.onClick}
                key={box.id}
                color={box.color}
            >
                {box.children}
            </div>}
        )}, [boxes_to_draw, canvas_size, enlarge_ratio]);

    // process page number request
    useEffect(() => {
        if (page) {
            setCurrentPage(page);
        }
    }, [page]);

    const setPage = (page: number) => {
        if (pdfRef) {
            setCurrentPage(page);
            reportChangePage?.(page);
        }
    }

    const nextPage = () => {
        if (pdfRef && currentPage < pdfRef.numPages) {
            const newpage = currentPage + 1;
            setCurrentPage(newpage);
            reportChangePage?.(newpage);
        }
    }

    const prevPage = () => {
        if (pdfRef && currentPage > 1) {
            const newpage = currentPage - 1;
            setCurrentPage(newpage);
            reportChangePage?.(newpage);
        }
    }

    return <div className="h-100 d-flex flex-column pb-2">
        <div className="mb-2">
            <ButtonToolbar aria-label="Toolbar with button groups">
                <ButtonGroup>
                    <Button variant="secondary" onClick={() => setPage(1)}>
                        <i className="fa-solid fa-angles-left"></i>
                    </Button>
                    <Button variant="secondary" onClick={prevPage}>
                        <i className="fa-solid fa-angle-left"></i>
                    </Button>
                    <Button variant="secondary" disabled style={{width: "8rem", backgroundColor: "#6c757d"}}>
                        Page {currentPage}
                    </Button>
                    <Button variant="secondary" onClick={nextPage}>
                        <i className="fa-solid fa-angle-right"></i>
                    </Button>
                    <Button variant="secondary" onClick={() => setPage(pdfRef?.numPages ?? 1)} className="me-2">
                        <i className="fa-solid fa-angles-right"></i>
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button variant="secondary" onClick={() => setEnlargeRatio(enlarge_ratio * 1.05)}>
                        <i className="fa-solid fa-magnifying-glass-plus"></i>
                    </Button>
                    <Button variant="secondary" onClick={() => setEnlargeRatio(enlarge_ratio / 1.05)}>
                    <i className="fa-solid fa-magnifying-glass-minus"></i>
                    </Button>
                    <Button variant="secondary" onClick={() => setEnlargeRatio(1)} className="me-2">Reset Ratio</Button>
                </ButtonGroup>
            </ButtonToolbar>
        </div>
        <div 
            className={"canvas1 flex-grow-1 overflow-auto " + styles.pdfViewArea} 
            ref={containerRef} 
            style={{width: window_width * 0.55, height: window_height * 0.7, backgroundColor: "#ccc"}}
        >
            <div className="position-relative">
                <canvas ref={canvasRef}></canvas>
                <div className="position-absolute w-100 h-100 top-0 start-0">
                    <div style={{position: 'relative', width: '100%', height: '100%'}}>
                        {boxes}
                    </div>
                </div>
            </div>
        </div>
    </div>;
}