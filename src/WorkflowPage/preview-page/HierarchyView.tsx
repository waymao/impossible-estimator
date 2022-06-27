import { changeValidationStatus, ProcessedDataPoint, RawDataPoint, UpdateDPResult } from "../datapoints";
import { ProcessedDPTreeNode, sortProceessedDP } from "../processed-dp-tree";
import { Collapse, Button } from 'react-bootstrap'
import React, { useEffect } from "react";
import styles from './hierarchyview.module.css';
import tbStyles from './table.module.css';
import { getCategoryHierarchy, HierarchyInfo } from "./category";
import { EditModal } from './HierarchyViewEditModal';

export interface ViewProps {
    processed_data: ProcessedDataPoint[],
    // raw_data: RawDataPoint,
    file_id: number,
    setPage: (page: number) => void,
    setCurrDP: (dp: ProcessedDataPoint) => void,
    reportDataUpdate: (dp: UpdateDPResult) => void
}


interface NodeProps {
    node: ProcessedDPTreeNode, 
    cat_name?: string, 
    init_open?: boolean,
    setPage: (page: number) => void,
    setCurrDP: (dp: ProcessedDataPoint) => void,
    reportDataUpdate: (dp: UpdateDPResult) => void,
    setEditingModalNode: (dp: ProcessedDataPoint) => void,
}

function HierarchyViewNode(props: NodeProps) {
    const {
        node, 
        cat_name, 
        init_open, 
        setPage, 
        setCurrDP, 
        reportDataUpdate, 
        setEditingModalNode
    } = props;
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        setOpen(init_open ?? false);
    }, []);

    const setDPForFocus = (dp: ProcessedDataPoint) => {
        setPage(dp.page);
        setCurrDP(dp);
    };

    const setVerified = (dp: ProcessedDataPoint, is_validated: boolean=true) => {
        reportDataUpdate({
            new_data: false,
            old_id: dp.id!,
            data: {
                ...dp,
                is_validated
            }
        });
        changeValidationStatus(dp.id!, is_validated);
    };

    return (
    <div>
        {cat_name && 
            <p className={"mb-1 d-flex " + tbStyles.tbRow} onClick={() => setOpen(!open)}>
                <Button className="link-icon-button me-2" variant="link">
                    {open ? 
                        <i className="fa-solid fa-minus"></i>:
                        <i className="fa-solid fa-plus"></i>
                    }
                </Button>
                {cat_name}
                {node.dps.length > 0 &&
                    <small className="ms-auto me-2">
                        {node.dps.find(
                            dp => dp.is_validated === true
                        )?.stat ?? <i>{"<unvalidated>"}</i>}
                    </small>
                }               
            </p>
        }
        <Collapse in={open}>
            <div>
                {node.children.size > 0 && Array.from(node.children).map(([key, child_node]) => (
                    <div className="ms-3" key={key}>
                        <HierarchyViewNode 
                            cat_name={key} 
                            node={child_node} 
                            key={key} 
                            setPage={setPage} 
                            setCurrDP={setCurrDP} 
                            setEditingModalNode={setEditingModalNode}
                            reportDataUpdate={reportDataUpdate}/>
                    </div>
                ))}
                {node.dps.length > 0 && node.dps.map((dp, idx) => 
                    <p className={"mb-1 ms-3 px-1 d-flex align-items-center " + tbStyles.tbRow} key={idx}>
                        <span className={dp.is_validated ? "fw-bold" : ""}>{dp.stat}</span>
                        {dp.is_validated && <i className="fa-solid fa-circle-check ms-1"></i>}
                        <small className="ms-auto me-2 text-secondary">Page {dp.page}</small>
                        <Button variant="link" className="link-icon-button" onClick={() => setEditingModalNode(dp)}>
                            <i className="fa-solid fa-pen"></i>
                        </Button>
                        <Button variant="link" className="link-icon-button" onClick={() => setDPForFocus(dp)}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </Button>
                        <Button variant="link" className="link-icon-button px-auto me-2" style={{width: "1rem"}} onClick={() => setVerified(dp, !dp.is_validated)}>
                            {dp.is_validated ?
                                <i className="fa-solid fa-xmark"></i> :
                                <i className="fa-solid fa-check"></i>
                            }
                        </Button>
                    </p>
                )}
            </div>
        </Collapse>
    </div>
    );
}

export default function HierarchyView(props: ViewProps) {
    const { processed_data, setPage, setCurrDP, reportDataUpdate } = props;
    const [ edit_node, setEditingNode ] = React.useState<ProcessedDataPoint>();
    const [ category_info, setCategoryInfo ] = React.useState<HierarchyInfo>();
    const data_tree = sortProceessedDP(processed_data);

    useEffect(() => {
        getCategoryHierarchy().then(setCategoryInfo);
    }, []);

    console.log(category_info)
    return !category_info ? <></> :
    <div className="overflow-auto" style={{height: "75vh"}}>
        <HierarchyViewNode 
            node={data_tree} 
            init_open={true} 
            setPage={setPage} 
            setCurrDP={setCurrDP} 
            reportDataUpdate={reportDataUpdate}
            setEditingModalNode={setEditingNode}/>
        {edit_node &&
            <EditModal 
                dp={edit_node}
                setDp={setEditingNode}
                setEditingNode={setEditingNode} 
                hierarchy_info={category_info} 
                reportDataUpdate={reportDataUpdate}/>
        }
    </div>;
}

