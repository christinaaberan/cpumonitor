import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import LineChart from "./components/linechart";
import "./App.css";

const ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? window.location.hostname
    : 'https://localhost:4001';

function App() {
  const [response, setResponse] = useState(0);
  const [historicData, setHistoricData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [downTime, setDownTime] = useState(0);
  const [downCount, setDownCount] = useState(0);
  const [recovered, setRecovered] = useState(false);
  const [recoveredTime, setRecoveredTime] = useState(null);

  const okUsageMin = 75;
  const badUsageMin = 100;

  const setUsageColor = (val) => {
    if (val < okUsageMin) {
      return "good";
    } else if (val >= okUsageMin && val < 1) {
      return "ok";
    } else {
      return "bad";
    }
  };

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", (data) => {
      setResponse(data);
      setHistoricData((currentState) =>
        [
          {
            id: data.timestamp,
            time: data.timestamp,
            usage: data.usage,
          },
          ...currentState,
        ].slice(0, 59)
      );
      setGraphData((currentData) => [
        ...currentData,
        { time: data.timestamp, usage: data.usage },
      ]);
    });
  }, []);

  useEffect(() => {
    let slicedGraphData = [];
    if (graphData.length >= 59) {
      graphData.shift();
    } 
    if (response.usage > badUsageMin) {
      if (downTime === 0) {
        setDownCount((lastVal) => lastVal + 1);
      }
      setDownTime((lastVal) => lastVal + 10000);
    }
    if (downTime > 0 && response.usage <= badUsageMin) {
      setRecovered(true);
      setRecoveredTime(response.timestamp);
      setDownTime(0);
    } else {
      setRecovered(false);
    }
    console.log(graphData)
    
  }, [historicData]);

  return (
    <>
      <header data-testid="heading">
        <div className="container">
          <h1>CPU Usage Dashboard</h1>
          {response.usage > badUsageMin && (
            <div className="alert alert-danger">
              <p>HIGH USAGE: CPU levels above 100% for {downTime}</p>
            </div>
          )}
          {recovered && (
            <div className="alert alert-success">
              <p>
                Recovered! Your CPU usage levels returned to normal at{" "}
                {response.timestamp}
              </p>
            </div>
          )}
        </div>
      </header>
      <main>
        <section className="item-a">
          {graphData.length >= 1 && (
            <LineChart
              style={`visibility:${response ? "visible" : "hidden"}`}
              graphData={graphData}
            />
          )}
        </section>
        <section className="item-b">
          <div style={{ height: "200px" }}>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Usage %</th>
                </tr>
              </thead>
              <tbody>
                {historicData.map((element, i) => {
                  return (
                    <tr key={`${element.time}-i`}>
                      <td>{element.time}</td>
                      <td>{element.usage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <section className="item-c">
          <h2 className={`current-usage ${setUsageColor(response.usage)}`}>
            {response.usage && `${response.usage}%`}
          </h2>
          <h4>Current Average CPU Usage</h4>
          {recoveredTime != null && (
            <p>Last recovered from outage: {recoveredTime}</p>
          )}
          {downCount > 0 && <p>Total outages: {downCount}</p>}
        </section>
      </main>
    </>
  );
}

export default App;
