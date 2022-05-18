import React, {useState, useEffect} from "react";
import { API_HOST } from '../config';

const EXTRACT_URL = API_HOST + '/extract';
 
export default function UploadMetricModal() {
    const [inEditMode, setInEditMode] = useState({
        status: false,
        rowKey: -1,
      });
    const [metrics, setMetrics] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [currMetric, setCurrMetric] = useState('');
    const [currAssocList, setCurrAssocList] = useState('');
    const [currType, setCurrType] = useState('');
    const [newMetric, setNewMetric] = useState('');
    const [catOptions, setCatOptions] = useState<any[]>([]);
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
      var categoryOptions = [];
      categoryOptions.push(<option></option>);
      categoriesf.forEach((cat: any) => {
        categoryOptions.push(
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>);
      });
      setCatOptions(categoryOptions);
    }

    useEffect(() => {
        fetchMetrics();
        fetchCategories();
    }, []);

    const onEdit = ({ id, currMetric, currAssocList, currType }:{id: number, currMetric: string, currAssocList: string, currType: string}) => {
        setInEditMode({
          status: true,
          rowKey: id,
        });
        setCurrMetric(currMetric);
        setCurrAssocList(currAssocList);
        setCurrType(currType);
    };

    const onCancel = () => {
        // reset the inEditMode state value
        setInEditMode({
          status: false,
          rowKey: -1,
        });
        // reset the unit price state value
        setCurrMetric('');
        setCurrAssocList('');
        setCurrType('');
    };

    const updateMetric = ({ id, currMetric, currAssocList, currType }:{id: number, currMetric: string, currAssocList: string, currType: string}) => {
        const updateArray: any[] = [];
        const wordArray = currAssocList.split(', ');
        wordArray.forEach((elem) => {
          updateArray.push([elem]);
        })
        fetch(`${EXTRACT_URL}/metrics/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: currMetric,
            synonyms: updateArray,
            category: currType,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => response.json())
          .then(() => {
            // reset inEditMode and unit price state values
            onCancel();
    
            // fetch the updated data
            fetchMetrics();
          });
    };

    const deleteMetric = ({ id }:{id: number}) => {
        fetch(`${EXTRACT_URL}/metrics/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }).then(() => {
          // fetch the updated data
          fetchMetrics();
        });
    };

    const addMetric = () => {
        fetch(`${EXTRACT_URL}/metrics`, {
            method: 'POST',
            body: JSON.stringify({
                name: newMetric,
                synonyms: [],
                category: 1,
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }).then(() => {
            // fetch the updated data
            fetchMetrics();
          });
    }

    return (categories===[] && metrics===[]) ? (
    <div>Loading...</div>
    ) : (
      
        <div>
            <table className="table">
                <thead className="header">
                    <tr>
                        <th>Category</th>
                        <th>Metric</th>
                        <th>Associated Words</th>
                    </tr>
                </thead>
                <tbody>
                {metrics.map(metric => {
                    return <tr key={metric.id}>
                        <td>{inEditMode.status && inEditMode.rowKey === metric.id ? (
                        <select name="category" 
                                onChange={(event) => setCurrType(event.target.value)}
                                defaultValue={metric.category}>
                          {catOptions}
                        </select>
                        ) : (
                            metric.category_name
                        )}</td>
                        <td>{inEditMode.status && inEditMode.rowKey === metric.id ? (
                        <input
                            type="text"
                            defaultValue={metric.name}
                            onChange={(event) => setCurrMetric(event.target.value)}
                        />
                        ) : (
                            metric.name
                        )}</td>
                        <td>{inEditMode.status && inEditMode.rowKey === metric.id ? (
                        <input
                            type="text"
                            defaultValue={metric.synonyms.join(', ')}
                            onChange={(event) => setCurrAssocList(event.target.value)}
                        />
                        ) : (
                            metric.synonyms.join(', ')
                        )}</td>
                        <td>{inEditMode.status && inEditMode.rowKey === metric.id ? (
                          <React.Fragment>
                            <button className="btn btn-primary"
                              onClick={() =>
                                updateMetric({
                                  id: metric.id,
                                  currMetric: currMetric,
                                  currAssocList: currAssocList,
                                  currType: currType,
                                })
                              }
                            >
                              SAVE
                            </button>

                            <button className="btn btn-primary"
                              style={{ marginLeft: 8 }}
                              onClick={() => onCancel()}
                            >
                              CANCEL
                            </button>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <button className="btn btn-primary" style={{marginRight: '1rem'}}
                              onClick={() =>
                                onEdit({
                                  id: metric.id,
                                  currMetric: metric.name,
                                  currAssocList: metric.synonyms.join(', '),
                                  currType: metric.category,
                                })
                              }
                            >
                              EDIT
                            </button>
                            <button className="btn btn-primary" onClick={() =>
                                    deleteMetric({id: metric.id})
                                }>
                                    DELETE
                            </button>
                          </React.Fragment>
                        )}</td>
                        </tr>
                })}
                </tbody>

            </table>
            <input defaultValue={newMetric} onChange={(event) => setNewMetric(event.target.value)}></input>
            <button className="btn btn-primary mx-2" onClick={addMetric}> Add Metric </button>
        </div>

      );
}