import React, {useState, useEffect} from 'react';
import { ReactComponent as TrashIcon } from '../img/trash-icon.svg';
import { ReactComponent as EditIcon } from '../img/edit-icon.svg';
import { ReactComponent as CheckIcon } from '../img/check-icon.svg';
import { ReactComponent as BackIcon } from '../img/back-icon.svg';
import styles from './customization-modal.module.css';
import { Button, Modal } from 'react-bootstrap';
import { API_HOST } from '../config';

const EXTRACT_URL = API_HOST + '/extract';

export default function CustomizationModal() {
  const [categories, setCategories] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [currCategoryID, setCurrCategoryID] = useState('');
  const [currCategoryName, setCurrCategoryName] = useState('');
  const [currCategoryKws, setCurrCategoryKws] = useState<{[key: string]:string[][]}>({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currKey, setCurrKey] = useState('');
  const [currKeyName, setCurrKeyName] = useState('');
  const [currKWs, setCurrKWs] = useState('');
  const [oldKey, setOldKey] = useState('');
  const [currMetricID, setCurrMetricID] = useState('');
  const [currMetricName, setCurrMetricName] = useState('');
  const [currMetricSyns, setCurrMetricSyns] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const fetchMetrics = async () => {
    const metricsf = await fetch(`${EXTRACT_URL}/metrics`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then(res => res.json());
    setMetrics(metricsf);
  }
  const fetchCategories = async () => {
    const categoriesf = await fetch(`${EXTRACT_URL}/categories`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then(res => res.json());
    setCategories(categoriesf);
  }

  useEffect(() => {
    fetchMetrics();
    fetchCategories();
  }, []);

  const handleModalClose = () => {
    setCurrKey('');
    setCurrKeyName('');
    setCurrKWs('');
    setOldKey('');
    setCurrMetricID('');
    setCurrMetricName('');
    setCurrMetricSyns('');
    setShowDetailModal(false);
  }

  const resetAllStates = () => {
    setCurrKey('');
    setCurrKeyName('');
    setCurrKWs('');
    setOldKey('');
    setCurrMetricID('');
    setCurrMetricName('');
    setCurrMetricSyns('');
    setCurrCategoryID('');
    setCurrCategoryKws({});
    setCurrCategoryName('');
  }

  const synsToString = (syns: string[][]) => {
    return syns.map(syn => {return syn.map(s => {return s}).join(' ')}).join(', ');
  }

  const stringToSyns = (s: string) => {
    return s.split(',').map(syn => {return syn.trim()}).map(syn => {return syn.split(' ')});
  }

  const handleCreateCategory = () => {
    fetch(`${EXTRACT_URL}/categories`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'New Category',
        keywords: {},
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(() => fetchCategories());
    setCurrCategoryID(Math.max(...categories.map(c => parseInt(c.id))).toString());
    setCurrCategoryName('New Category');
    setCurrCategoryKws({});
  }

  const updateCurrCategory = () => {
    fetch(`${EXTRACT_URL}/categories/${currCategoryID}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: currCategoryName,
        keywords: currCategoryKws
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }

  const deleteCurrCategory = () => {
    fetch(`${EXTRACT_URL}/categories/${currCategoryID}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(() => {fetchCategories(); fetchMetrics()});

    // Reset all states
    resetAllStates();
  }

  const createCurrMetric = () => {
    fetch(`${EXTRACT_URL}/metrics`, {
      method: 'POST',
      body: JSON.stringify({
        name: currMetricName,
        category: currCategoryID,
        synonyms: stringToSyns(currMetricSyns),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(()=>{fetchMetrics();});
  }

  const updateCurrMetric = () => {
    fetch(`${EXTRACT_URL}/metrics/${currMetricID}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: currMetricName,
        category: currCategoryID,
        synonyms: stringToSyns(currMetricSyns),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(()=>{fetchMetrics();});
  }

  const deleteCurrMetric = () => {
    fetch(`${EXTRACT_URL}/metrics/${currMetricID}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(()=>{fetchMetrics();});
  }

  const handleSaveKW = () => {
    if (currKey!=='-1') {
      if (currKey===oldKey) {
        const {oldKey, ...rest} = currCategoryKws;
        setCurrCategoryKws(rest);
      }
      const temp = currCategoryKws;
      temp[currKey] = stringToSyns(currKWs.toLowerCase());
      setCurrCategoryKws(temp);
    }
    updateCurrCategory();
    handleModalClose();
  }

  const handleDeleteKW = () => {
    if (currKey!=='-1' && currKey===oldKey) {
      delete currCategoryKws[currKey]
      updateCurrCategory();
    }
    handleModalClose();
  }

  const handleSaveMetric = () => {
    if (currMetricID==='-1') {
      createCurrMetric();
    } else {
      updateCurrMetric();
    }
    handleModalClose();
  }

  const handleDeleteMetric = () => {
    if (currMetricID!=='-1') {
      deleteCurrMetric();
    }
    handleModalClose();
  }

  return (
    (currCategoryID === '') ? <div>
      {categories.map(category => {
        return <button 
                  key={category.id} 
                  className={styles.list_item + ' btn btn-primary'}
                  onClick={() => {setCurrCategoryID(category.id);
                                  setCurrCategoryName(category.name);
                                  setCurrCategoryKws(category.keywords)}}
                >
                  {category.name}
                </button>}
      )}
      <button 
        key={-1} 
        className={styles.list_item + ' btn btn-primary'}
        onClick={() => handleCreateCategory()}
      >
        +
      </button>
    </div> 
    : 
    <div>
      <div style={{marginBottom: '1rem'}} onClick={() => resetAllStates()}>
        <BackIcon className={styles.icon} style={{marginRight: '0.2rem'}}/>Back
      </div>
      <input
        type='text'
        style={{border: 'none', fontSize: '2rem', fontWeight: 'bold', width: '20%'}}
        defaultValue={currCategoryName}
        disabled={!isEditingName}
        onChange={(event) => {setCurrCategoryName(event.target.value);}}
      />
      {isEditingName ? 
        <CheckIcon className={styles.icon} onClick={() => {updateCurrCategory();
                                                           setIsEditingName(false);}}/>
        :
        <EditIcon className={styles.icon} onClick={() => setIsEditingName(true)}/>    
      }
      <TrashIcon className={styles.icon} onClick={() => deleteCurrCategory()}/>

      <p style={{marginTop: '1rem', marginBottom: '0'}}>
        Category Keywords:
      </p>
      <div className={styles.list}>
        {Object.entries(currCategoryKws).map(([k, v]) => {
          return <button
              key={k}
              className={styles.list_item + ' btn btn-primary'}
              onClick={() => {setCurrKey(k);
                              setCurrKeyName(k);
                              setCurrKWs(synsToString(v));
                              setOldKey(k);
                              setShowDetailModal(true);}}
            >
              {k}
            </button>
        })}
        <button 
          key={'-1'} 
          className={styles.list_item + ' btn btn-primary'}
          onClick={() => {setCurrKey('-1');
                          setShowDetailModal(true);}}
        >
          +
        </button>
      </div>
      <p style={{marginTop: '1rem', marginBottom: '0'}}>
        Metrics:
      </p>
      <div className={styles.list}>
        {metrics.filter(m => m.category===currCategoryID).map(m => {
          return <button
              key={m.id}
              className={styles.list_item + ' btn btn-primary'}
              onClick={() => {setCurrMetricID(m.id);
                              setCurrMetricName(m.name);
                              setCurrMetricSyns(synsToString(m.synonyms));
                              setShowDetailModal(true);}}
            >
              {m.name}
            </button>
        })}
        <button 
          key={'-1'} 
          className={styles.list_item + ' btn btn-primary'}
          onClick={() => {setCurrMetricID('-1');
                          setShowDetailModal(true);}}
        >
          +
        </button>
      </div>
      <Modal 
        size='sm' 
        show={showDetailModal} 
        onHide={handleModalClose}
        centered>
      <Modal.Header closeButton>
        <Modal.Title>{showDetailModal ? currKey==='' ? 'Edit Metric' : 'Edit Keyword' : ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div style={{marginBottom: '1rem'}}>
            <p style={{marginBottom: '0'}}>Name: </p>
            <input 
              type='text' 
              defaultValue={currKey==='' ? currMetricName : currKeyName} 
              onChange={(event) => {currKey==='' ? setCurrMetricName(event.target.value) : setCurrKey(event.target.value)}}
            />
          </div>
          <div>
            <p style={{marginBottom: '0'}}>Synonyms:</p>
            <textarea
              defaultValue={currKey==='' ? currMetricSyns : currKWs}
              style={{minHeight: '5rem'}}
              onChange={(event) => {currKey==='' ? setCurrMetricSyns(event.target.value) : setCurrKWs(event.target.value)}}
            />
          </div>
        </div> 
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={() => currKey==='' ? handleDeleteMetric() : handleDeleteKW()}>
          Delete
        </Button>
        <Button variant='primary' onClick={() => currKey==='' ? handleSaveMetric() : handleSaveKW()}>
          Save
        </Button>
        <Button variant='primary' onClick={handleModalClose}>
          Cancel
        </Button>
      </Modal.Footer>
      </Modal>
    </div>);
}