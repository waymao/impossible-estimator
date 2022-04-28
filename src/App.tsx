import React from 'react';
import './App.css';
// import '@fortawesome/fontawesome-free/js/all.js';
import '@fortawesome/fontawesome-free/css/all.css';

import {
  Routes,
  Route,
} from "react-router-dom";
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";

import 'bootstrap/dist/css/bootstrap.min.css';
import { UploadPage } from './UploadPage/UploadPage';
import WorkflowPage from './WorkflowPage/WorkflowPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UploadPage />}/>
        <Route path="/process/*" element={<WorkflowPage />}/>
      </Routes>
    </div>
  );
}

export default App;
