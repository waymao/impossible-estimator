import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// import { pdfjsWorker } from 'pdfjs-dist/build/pdf.worker.entry';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { Button } from 'react-bootstrap';
import { ProcessedDataPoint } from './datapoints';

export default function PDFViewer({url, page, data}: {url: string, page?: number, data?: ProcessedDataPoint[]}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    console.log(data);

    const [pdfRef, setPdfRef] = useState<PDFDocumentProxy>();
    const [currentPage, setCurrentPage] = useState(1);
    const [needs_draw_box, setNeedsBox] = useState(false);

    const renderPage = useCallback((pageNum, pdf=pdfRef) => {
        pdf && pdf.getPage(pageNum).then((page: PDFPageProxy) => {
        const viewport = page.getViewport({scale: 1});
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const context = canvas.getContext('2d');
            if (context !== null) {
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
                setNeedsBox(true);
            }
            console.log(canvas.height, canvas.width);
        }
        });
    }, [pdfRef]);

    useEffect(() => {
        renderPage(currentPage, pdfRef);
    }, [pdfRef, currentPage, renderPage]);

    useEffect(() => {
        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then((loadedPdf: any) => {
        setPdfRef(loadedPdf);
        });
    }, [url]);

    // process page number request
    useEffect(() => {
        if (page) {
            setCurrentPage(page);
        }
    }, [page]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (needs_draw_box && canvas !== null && data !== undefined) {
            const context = canvas.getContext('2d');
            if (context !== null) {
                for (const datapoint of data) {
                    console.log("draw begin")
                    const c1 = datapoint.coord;
                    const c2 = datapoint.stat_coord;
                    console.log(c1, c2);
                    context.beginPath();
                    context.rect(c1[0], c1[1], c1[2] - c1[0], c1[3] - c1[1]);
                    context.stroke();
                    context.beginPath();
                    context.rect(c2[0], c2[1], c2[2] - c2[0], c2[3] - c2[1]);
                    context.stroke();
                }
                context.beginPath();
                context.rect(0, 0, 100, 100);
                context.stroke();
                setNeedsBox(false);
            }
        }
    }, [data, needs_draw_box]);

    const nextPage = () => pdfRef && currentPage < pdfRef.numPages && setCurrentPage(currentPage + 1);

    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    return <div>
        <div className="canvas1">
            <div className="position-absolute"></div>
            <canvas ref={canvasRef}></canvas>
        </div>

        <br/>
        <Button onClick={prevPage} className="me-2">Prev Page</Button>
        <Button onClick={nextPage} className="me-2">Next Page</Button>
        <span>Current page: {currentPage}</span>
    </div>;
}