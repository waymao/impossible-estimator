import { ProcessedDataPoint, RawDataPoint } from "../datapoints";
import { ProcessedDPTreeNode, sortProceessedDP } from "../processed-dp-tree";
import { Collapse, Button } from 'react-bootstrap'
import React from "react";
import styles from './hierarchyview.module.css'

export interface ViewProps {
    processed_data: ProcessedDataPoint[],
    // raw_data: RawDataPoint,
    file_id: number,
    setPage: (page: number) => void,
    setCurrDP: (dp: ProcessedDataPoint) => void
}


interface NodeProps {
    node: ProcessedDPTreeNode, 
    cat_name?: string, 
    init_open?: boolean,
    setPage: (page: number) => void,
    setCurrDP: (dp: ProcessedDataPoint) => void
}
function HierarchyViewNode({node, cat_name, init_open, setPage, setCurrDP}: NodeProps) {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        setOpen(init_open ?? false);
    }, []);

    const setDPForFocus = (dp: ProcessedDataPoint) => {
        setPage(dp.page);
        setCurrDP(dp);
    }
    return (
    <div>
        {cat_name && 
            <p className="mb-1" onClick={() => setOpen(!open)}>
                <Button className={styles.switchBtn} variant="light">
                    {open ? 
                        <i className="fa-solid fa-minus"></i>:
                        <i className="fa-solid fa-plus"></i>
                    }
                </Button>
                {cat_name}
            </p>
        }
        <Collapse in={open}>
            <div>
                {node.children.size > 0 && Array.from(node.children).map(([key, child_node]) => (
                    <div className="ms-3" key={key}>
                        <HierarchyViewNode cat_name={key} node={child_node} key={key} setPage={setPage} setCurrDP={setCurrDP}/>
                    </div>
                ))}
                {node.dps.length > 0 && node.dps.map(dp => 
                    <p className="mb-1 ms-3 d-flex align-items-center">
                        <b>{dp.stat}</b>
                        <small className="ms-auto me-2 text-secondary">Page {dp.page}</small>
                        <Button variant="link" className="link-icon-button me-2" onClick={() => setDPForFocus(dp)}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </Button>
                    </p>
                )}
            </div>
        </Collapse>
    </div>
    );
}

export default function HierarchyView(props: ViewProps) {
    const { processed_data, setPage, setCurrDP } = props;
    const data_tree = sortProceessedDP(processed_data);
    return <div className="overflow-auto" style={{height: "75vh"}}>
        <HierarchyViewNode node={data_tree} init_open={true} setPage={setPage} setCurrDP={setCurrDP}/>
    </div>;
}