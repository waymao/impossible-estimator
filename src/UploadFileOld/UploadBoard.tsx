import UploadPage from "./UploadPage";
import ReviewPage from './ReviewPage';
import {DetectInfo} from './DetectInfo';
import React from 'react';


export default function UploadBoard() {
    const [data, setData] = React.useState<DetectInfo | undefined>(undefined);
    const [file, setFile] = React.useState<File | undefined>(undefined);
    return !data ? <ReviewPage info={data} file={file}/> :
        <UploadPage updateData={setData} updateFile={setFile}/>;
}