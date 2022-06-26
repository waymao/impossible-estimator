import styles from './PreviewPage.module.css';
import React, { useState, useEffect, useCallback } from 'react';
import PDFViewer, { BoxToDraw } from './PDFViewer';
import { ExtractResult, getTransformedDataPoint, ProcessedDataPoint, UpdateDPResult, TransformResult, getExtractedDataPoint, RawDataPoint } from '../datapoints';
import { useParams } from 'react-router';
import { Tabs, Tab } from 'react-bootstrap';
import { FileInfo, getFileInfo } from '../files';
import ProcessedTable from './ProcessedTable';
import RawDataTable from './RawDataTable';
import EditPanel from './EditPanel';
import HierarchyView from './HierarchyView';

type Mode = 'raw_all' | 'edit' | 'processed' | "tree";

export function PreviewPage() {
    const file_id = useParams().file_id;
    const [file_info, setFileInfo] = React.useState<FileInfo | null>();
    const [data, setData] = React.useState<TransformResult>();
    const [raw_data, setRawData] = React.useState<ExtractResult>();
    const [mode, setMode] = React.useState<Mode>('tree');
    const [page, setPage] = React.useState<number>(1);
    const [override, setOverride] = React.useState<boolean>(false);
    

    const changePage = (page: number) => {
        setEditingNode(null);
        if (mode === 'edit') {
            setMode('processed');
            setSelectedData(null);
        } else if (mode === 'tree') {
            setTreeDP(undefined);
        }
        setPage(Math.max(1, page));
    }

    useEffect(() => {
        if (file_id === undefined) return;
        getFileInfo(file_id).then(setFileInfo);
        getExtractedDataPoint(file_id).then(setRawData);
        getTransformedDataPoint(file_id).then(setData);
    }, [file_id])


    /*
     * Utils for Selecting Node
     */
    const [editing_node, setEditingNode] = React.useState<RawDataPoint | null>(null);
    const [selected_data, setSelectedData] = React.useState<RawDataPoint | null>(null);
    const enterEditMode = (data: RawDataPoint) => {
        setPage(data.page);
        setOverride(false);
        setEditingNode(data);
        setMode('edit');
        setSelectedData(null);
    };
    const enterEditModeFromTransform = (point: ProcessedDataPoint) => {
        setPage(point.page);
        setOverride(true);
        const editing_node = raw_data?.raw_data?.find(item => item.id === point.ref_sub);
        const selected_data = raw_data?.raw_data?.find(item => item.id === point.ref_num);
        if (editing_node) {
            setEditingNode(editing_node);
            setMode('edit');
            setSelectedData(selected_data ?? null);
        }
    };

    /* 
     * Data selection
     */
    const selectData = (data: RawDataPoint) => {
        if (mode === 'edit' && data.type === 'NUM') {
            setSelectedData(data);
        } else {
            console.log(data.content);
        }
    }

    const reportDataUpdate = (result: UpdateDPResult) => {
        if (result.new_data) {
            const new_data = {...data} as TransformResult;
            new_data?.processed_datas?.push(result.data);
            setData(new_data);
        } else {
            const new_data = {...data} as TransformResult;
            new_data.processed_datas = new_data.processed_datas.map(
                item => {
                    if (item.id === result.old_id) {
                        return result.data
                    } else {
                        return item
                    }
                })
            setData(new_data);
        }
        if (mode === 'edit') setMode('processed');
    }

    const cancelDataUpdate = () => {
        setMode('processed');
        setSelectedData(null);
    }

    const [ curr_tree_dp, setTreeDP ] = React.useState<ProcessedDataPoint>();
    const boxes_data: BoxToDraw[] = React.useMemo(() => {
        // returns processed data or raw data based on user selection
        if (mode === "tree") {
            if (!curr_tree_dp) {
                return [];
            }
            return [
                {
                    x1: curr_tree_dp.coord[0],
                    y1: curr_tree_dp.coord[1],
                    x2: curr_tree_dp.coord[2],
                    y2: curr_tree_dp.coord[3], 
                    color: 'black',
                    id: `processed-keyword-${curr_tree_dp.id}`
                }, {
                    x1: curr_tree_dp.stat_coord[0],
                    y1: curr_tree_dp.stat_coord[1],
                    x2: curr_tree_dp.stat_coord[2],
                    y2: curr_tree_dp.stat_coord[3], 
                    color: 'red',
                    id: `processed-stat-${curr_tree_dp.id}`
                }
            ]; 
        } else if (mode === 'processed') {
            return data?.processed_datas
                .filter(item => item.page === page)
                .flatMap(item => ([{
                    x1: item.coord[0],
                    y1: item.coord[1],
                    x2: item.coord[2],
                    y2: item.coord[3], 
                    color: 'black',
                    id: `processed-keyword-${item.id}`
                }, {
                    x1: item.stat_coord[0],
                    y1: item.stat_coord[1],
                    x2: item.stat_coord[2],
                    y2: item.stat_coord[3], 
                    color: 'red',
                    id: `processed-stat-${item.id}`
                }])) ?? [];
        } else if (mode === 'raw_all') {
            return raw_data?.raw_data
                    .filter(item => item.page === page)
                    .map(item => ({
                        x1: item.coord[0],
                        y1: item.coord[1],
                        x2: item.coord[2],
                        y2: item.coord[3], 
                        color: 'blue',
                        id: `raw_all-${item.id}`,
                        onClick: item.type === 'STR' ?
                                    () => enterEditMode(item) :
                                    () => console.log(item.content)
            })) ?? [];
        } else {
            if (!editing_node) return [];
            const arr = raw_data?.raw_data
                .filter(item => item.page === page && item.type === 'NUM')
                .map(item => ({
                    x1: item.coord[0],
                    y1: item.coord[1],
                    x2: item.coord[2],
                    y2: item.coord[3], 
                    id: `editing-${item.id}`,
                    color: (selected_data && selected_data.id === item.id) ? 'red' : 'blue',
                    onClick: () => selectData(item)
                })
            )
            arr?.push({
                x1: editing_node.coord[0],
                y1: editing_node.coord[1],
                x2: editing_node.coord[2],
                y2: editing_node.coord[3], 
                color: 'black',
                id: `editing-currnode-${editing_node.id}`,
                onClick: () => {console.log(editing_node.content);}
            })
            return arr ?? [];
        }
    }, [data, raw_data, selected_data, mode, page, curr_tree_dp]);

    if (file_id === undefined) {
        return <div>
            <h2>Error: Filename not defined</h2>
        </div>
    } else if (file_info === undefined || data === undefined || raw_data === undefined) {
        return <div>
            <p>Loading...</p>
        </div>
    } else if (file_info === null) {
        return <div>
            <p>404: File Not Found</p>
        </div>
    }

    return <div className={styles.previewPageBoard}>
        <div className={styles.ListPanel + "  col-4"}>
        <Tabs 
            defaultActiveKey="tree" 
            activeKey={mode}
            onSelect={(k) => setMode(k as Mode)}
            className="mb-3"
        >
            <Tab eventKey="tree" title="Tree View">
                <HierarchyView 
                    processed_data={data.processed_datas}
                    file_id={file_info.id}
                    setPage={changePage}
                    setCurrDP={setTreeDP}
                    reportDataUpdate={reportDataUpdate}/>
            </Tab>
            <Tab eventKey="processed" title="Processed Data">
                <ProcessedTable filter_page={page} filename={file_info.name} data={data} setPage={changePage} setCurrentKeyword={enterEditModeFromTransform}/>
            </Tab>
            <Tab eventKey="raw_all" title="Raw Data">
                <RawDataTable filter_page={page} filename={file_info.name} data={raw_data} setPage={changePage} setCurrentKeyword={enterEditMode}/>
            </Tab>
            <Tab eventKey="edit" title="Edit" disabled={(editing_node === null)}>
                {editing_node !== null ? 
                    <EditPanel 
                        file_id={data.id}
                        processed_data={undefined} 
                        raw_data={editing_node} 
                        candidate_data={selected_data || undefined}
                        reportUpdate={reportDataUpdate}
                        cancelUpdate={cancelDataUpdate}
                        override={override}
                    /> :
                    <p>Error</p>}
            </Tab>
        </Tabs>
        </div>
        <div className="col-8 h-100">
            <PDFViewer 
                url={file_info?.path ?? ""}
                boxes_to_draw={boxes_data} 
                page={page}
                reportChangePage={changePage}
            />
        </div>
    </div>;
}
