/*
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import CustomPrompt from './CustomPrompt';
*/

import React from 'react';
import { Link } from 'react-router-dom';


const Home: React.FC = () => {

    /*
    let history = useHistory();

    const [promptVisible, setPromptVisible] = useState<boolean>(false);

    const handleClosePrompt = () => {
        setPromptVisible(false);
    }
    */
    
    /*
    const handleTemplateClick = async (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {

        if(promptVisible){
            return;
        }

        const templateSelect = event.currentTarget.alt;

        //check if exist file for the day, independently the template
        const possibleFile = 'debriefing_' + getCurrentDate() + '.md';
        const dataFetched = await fetch('http://localhost:3001/file/type/' + possibleFile);
        const templateFromServer = await dataFetched.text();


        if (templateSelect === 'template_1' && templateFromServer === 'template_1') {
            history.push('/createReport/' + possibleFile);
        }
        else if (templateSelect === 'template_2' && templateFromServer === 'template_2') {
            history.push('/createReport_2/' + possibleFile);
        }
        else if (templateFromServer === 'Cannot find file') {
            if (templateSelect === 'template_1') {
                history.push('/createReport/');
            }
            else if (templateSelect === 'template_2') {
                history.push('/createReport_2');
            }
            else {
                console.log('template not selected');
            }
        }
        else {
            setPromptVisible(true);
        }
    }
    */
    
    // if only use one state
    /*
    const newTo = {
        pathname: "/createReport",
        template: 2
    };
    */

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