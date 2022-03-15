import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// import { pdfjsWorker } from 'pdfjs-dist/build/pdf.worker.entry';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { Button } from 'react-bootstrap';

export default function PDFViewer({url}: {url: string}){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  const [pdfRef, setPdfRef] = useState<PDFDocumentProxy>();
  const [currentPage, setCurrentPage] = useState(1);

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
        }
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

  const nextPage = () => pdfRef && currentPage < pdfRef.numPages && setCurrentPage(currentPage + 1);

  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return <div>
        <canvas ref={canvasRef}></canvas>
        <br/>
        <Button onClick={prevPage} className="me-2">Prev Page</Button>
        <Button onClick={nextPage}>Next Page</Button>
      </div>;
}