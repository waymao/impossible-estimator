import React, {useState, useEffect} from "react";
import { API_HOST } from '../config';

const EXTRACT_URL = API_HOST + '/extract';

export default function UploadMetricModal() {
    const [metrics, setMetrics] = useState<any[]>([]);
    const fetchMetrics = async () => {
        console.log(metrics);
        const metricsf = await fetch(`${EXTRACT_URL}/metrics`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(res => res.json());
        setMetrics(metricsf);
        console.log(metrics);

    }

    useEffect(() => {
        fetchMetrics();
    }, []);

    return (metrics===[]) ? (
    <div>Loading...</div>
    ) : (
    <div>
        {console.log(metrics)}
        <table>
            <thead className="header">
                <tr>
                    <th>Metric</th>
                </tr>
            </thead>
            <tbody>
            {metrics.map(metric => {
                return <tr key={metric.id}><td key={metric.word}>{metric.word}</td></tr>
            })}
            </tbody>

        </table>
        </div>

      );
}