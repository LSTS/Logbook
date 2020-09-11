import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import HomePage from '../Home/Home'
import LoadReport from '../LoadReport/LoadReport'
import CreateReport from '../CreateReport/CreateReport'
import CreateReport_2 from '../CreateReport_2/CreateReport_2'


const App: React.FC = () => {

    const handleExit = () => {
        console.log("LEAVING PAGE LOAD");
    }

    return (
        <Router>
            <div className="App">

                <h2>Mission LogBook</h2>

                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/loadReport" component={LoadReport} onLeave={handleExit}/>
                    <Route path="/createReport" component={CreateReport} />
                    <Route path="/createReport_2" component={CreateReport_2} />
                </Switch>
    
            </div>


        </Router>
    );
}

export default App;

