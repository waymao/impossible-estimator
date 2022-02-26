import Container from "react-bootstrap/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import { Row, Col } from 'react-bootstrap';

import {DetectInfo} from './DetectInfo';

interface Props {
    info?: DetectInfo,
    file: File | undefined
}

export default function ReviewPage({info, file}: Props) {
    return <Container className="my-5">
        <h1 className="mb-3">Inspect Document</h1>
        <Row>
            <Col lg="3">
                <ListGroup as="ol">
                <ListGroup.Item
                    as="li"
                    action
                    className="d-flex justify-content-between align-items-start"
                >
                    <div className="ms-2 me-auto">
                    <div className="fw-bold">Subheading</div>
                    Cras justo odio
                    </div>
                    <Badge pill>
                    14
                    </Badge>
                </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col>
                <p>Inspect item here...</p>
            </Col>
        </Row>
    </Container>
}