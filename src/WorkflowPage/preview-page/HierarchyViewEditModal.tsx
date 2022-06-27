import { manualAssignCategory, ProcessedDataPoint, RawDataPoint, UpdateDPResult } from "../datapoints";
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { CategoryInfo, HierarchyInfo } from "./category";
import React from "react";

interface EditModalProps {
    dp?: ProcessedDataPoint,
    setDp: (dp?: ProcessedDataPoint) => void,
    edit_node?: ProcessedDataPoint, 
    setEditingNode: (dp?: ProcessedDataPoint) => void,
    hierarchy_info: HierarchyInfo,
    reportDataUpdate: (dp: UpdateDPResult) => void,
}

export function EditModal({ dp, setDp, setEditingNode, hierarchy_info, reportDataUpdate}: EditModalProps) {
    const [ show, setShowModal ] = React.useState<boolean>();
    const [ category, setCategory ] = React.useState<string>();
    const [ metric, setMetric ] = React.useState<string>();
    const [ sub_metric, setSubMetric ] = React.useState<string>();

    React.useEffect(() => {
        if (dp) {
            setShowModal(true);
            setCategory(dp.category);
            setMetric(dp.metric);
            setSubMetric(dp.sub_metric);
        }
    }, [dp]);

    const { category_info, metric_info } = hierarchy_info;

    const setNewCat = (dp: ProcessedDataPoint, category?: string, metric?: string, sub_metric?: string) => {
        reportDataUpdate({
            new_data: false,
            old_id: dp.id!,
            data: {
                ...dp,
                category: category ?? dp.category,
                metric: metric ?? dp.metric,
                sub_metric: sub_metric ?? dp.sub_metric
            }
        });
        manualAssignCategory(dp.id!, category, metric, sub_metric);
        setEditingNode();
    };

    console.log("in???", (category ?? "") in category_info);

    return <Modal show={show} centered onHide={() => setEditingNode()} onExited={() => setDp()}>
        <Modal.Header closeButton>
            <Modal.Title>Change Data Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
            <Form.Group>
                <Form.Label>Data: <b>{dp?.stat}</b></Form.Label>
            </Form.Group>
            <Form.Group>
                <Form.Label>Associated Keyword: <b>{dp?.content}</b></Form.Label>
            </Form.Group>
            <Form.Group className="mb-3 mt-3">
                <Form.Label>Category: </Form.Label>
                {dp &&
                <Form.Select 
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setSubMetric(undefined);
                        setMetric(undefined);
                    }}>
                    <option key="empty" selected={(category ?? "") in category_info}> --- </option>
                    {Object.keys(category_info).map(key => 
                        <option key={key} value={key} selected={category === key}>{key}</option>
                    )}
                </Form.Select>
                }
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Metric: </Form.Label>
                {dp && category_info &&
                <Form.Select onChange={(e) => setMetric(e.target.value)}>
                    <option selected={
                        !((category ?? "") in category_info) || 
                        !((category ?? "") in metric_info) ||
                        !((metric ?? "") in metric_info[category ?? ""])}
                        value=""
                        key="empty"
                    >
                            --- 
                    </option>
                    {category && category in metric_info && metric_info[category].map(key => 
                        <option key={key} value={key} selected={metric === key}>{key}</option>
                    )}
                </Form.Select>
                }
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Sub-Metric: </Form.Label>
                {dp && category_info &&
                <Form.Select onChange={(e) => setSubMetric(e.target.value)}>
                    <option selected={
                        !((category ?? "") in category_info) || 
                        !((sub_metric ?? "") in category_info[category ?? ""])}
                        value=""
                        key="empty"
                    >
                            --- 
                    </option>
                    {category && category in category_info && category_info[category].map(key => 
                        <option key={key} value={key} selected={sub_metric === key}>{key}</option>
                    )}
                </Form.Select>
                }
            </Form.Group>
        </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditingNode()}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {if (dp) setNewCat(dp, category, metric, sub_metric)}}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>;
}
