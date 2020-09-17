import React from 'react';
import { Link } from 'react-router-dom';


const Home: React.FC = () => {
  
    return (
        <div className="buttons-index">

            <Link to="/loadReport" >
                <button className="button-load-report">
                    <span>Load report file</span>
                </button>
            </Link>

            {
            <Link to="/createReport">
                <button className="button-create-report" >
                    <span>Create report</span>
                </button>
            </Link>
            }        

        </div>
    );
}

export default Home; 