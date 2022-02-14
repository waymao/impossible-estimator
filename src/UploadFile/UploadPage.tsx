import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import React from 'react';
import { DetectInfo } from './DetectInfo';


interface Props{
    updateData: (obj: DetectInfo) => any,
    updateFile: (obj?: File) => any
}

export default function UploadPage({updateData, updateFile}: Props) {
    const [ file, setFile ] = React.useState<undefined | File>(undefined);
    const [ keyword, setKeyword ] = React.useState<undefined | string>(undefined);

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    const handleSubmit = async () => {
        let data = new FormData();
        data.append('keyword', keyword ?? "");
        data.append('file', file ?? "");
        const response = await fetch('/api/process/', {
            method: 'POST',
            body: data
        });
        const body = await response.json();
        console.log(body);
        updateData(body);
        updateFile(file);
    };
    return <Container className="my-3">
        <h1>Upload a PDF file for process...</h1>
        <Form>
            <Form.Group controlId="file" className="mb-3">
                <Form.Label>PDF upload</Form.Label>
                <Form.Control type="file" onChange={handleFileSelect}/>
            </Form.Group>
            <Form.Group controlId="keyword" className="mb-3">
                <Form.Label>Keyword</Form.Label>
                <Form.Control type="text" onChange={handleKeywordChange}/>
            </Form.Group>
            <Button onClick={handleSubmit}>Process</Button>
        </Form>
    </Container>
}