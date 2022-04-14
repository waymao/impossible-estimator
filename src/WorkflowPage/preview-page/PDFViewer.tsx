import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// import { pdfjsWorker } from 'pdfjs-dist/build/pdf.worker.entry';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { Button } from 'react-bootstrap';
import { ProcessedDataPoint } from '../datapoints';

export interface BoxToDraw {
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    color?: string,
    onClick?: () => void,
    href?: string,
    className?: string,
    style?: React.CSSProperties
}

const PDF_DRAW_SCALE = 2

export interface Props {
    url: string, 
    page?: number, 
    boxes_to_draw: BoxToDraw[],
    reportChangePage?: (a: number) => void
}

export default function PDFViewer({url, page, boxes_to_draw, reportChangePage}: Props){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    console.log(boxes_to_draw);

    // pdf.js document
    const [pdfRef, setPdfRef] = useState<PDFDocumentProxy>();
    // current page
    const [currentPage, setCurrentPage] = useState(1);
    // size of the canvas
    const [canvas_size, setCanvasSize] = useState<[number, number]>([0, 0]);
    const [viewport_s, setViewPort] = useState<pdfjsLib.PageViewport>();

    const renderPage = useCallback((pageNum, pdf=pdfRef) => {
        pdf && pdf.getPage(pageNum).then((page: PDFPageProxy) => {
        const viewport = page.getViewport({scale: PDF_DRAW_SCALE});
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.height = viewport.height / PDF_DRAW_SCALE + "px";
            canvas.style.width = viewport.width / PDF_DRAW_SCALE + "px";
            setCanvasSize([viewport.height / PDF_DRAW_SCALE, viewport.height / PDF_DRAW_SCALE]);

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
    }, [pdfRef]);

    // effect to render the page using pdf
    useEffect(() => {
        renderPage(currentPage, pdfRef);
    }, [pdfRef, currentPage, renderPage]);

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
            console.log(box);
            const rect = viewport_s.convertToViewportRectangle([box.x1, box.y2, box.x2, box.y1]) as number[];
            console.log(rect);
            return <div 
                style={{
                    left: rect[0] / viewport_s.width * 100 + '%',
                    top: rect[1] / viewport_s.height * 98.5 + '%', // TODO change coord
                    width: (rect[2] - rect[0]) / viewport_s.width * 100 + '%',
                    height: (rect[3] - rect[1]) / viewport_s.height * 100 + '%',
                    border: "1px solid " + box.color ?? "black",
                    position: "absolute",
                    ...box.style
                }}
                onClick={box.onClick}
            >
            </div>}
        )}, [boxes_to_draw, canvas_size]);

    // process page number request
    useEffect(() => {
        if (page) {
            setCurrentPage(page);
        }
    }, [page]);

    const nextPage = () => {
        if (pdfRef && currentPage < pdfRef.numPages) {
            const newpage = currentPage + 1;
            setCurrentPage(newpage);
            reportChangePage?.(newpage);
        }
    }

    const prevPage = () => {
        if (pdfRef && currentPage > 0) {
            const newpage = currentPage - 1;
            setCurrentPage(newpage);
            reportChangePage?.(newpage);
        }
    }

    return <div>
        <div className="canvas1 position-relative">
            <canvas ref={canvasRef}></canvas>
            <div className="position-absolute w-100 h-100 top-0 start-0">
                <div style={{position: 'relative', width: '100%', height: '100%'}}>
                    {boxes}
                </div>
            </div>
        </div>

        <br/>
        <Button onClick={prevPage} className="me-2">Prev Page</Button>
        <Button onClick={nextPage} className="me-2">Next Page</Button>
        <span>Current page: {currentPage}</span>
    </div>;
}