import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { getCurrentDate } from '../../lib/utils';
import CustomPrompt from './CustomPrompt';


const Home: React.FC = () => {

    let history = useHistory();

    const [promptVisible, setPromptVisible] = useState<boolean>(false);

    const handleClosePrompt = () => {
        setPromptVisible(false);
    }
    

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
    
    // if only use one state
    /*
    const newTo = {
        pathname: "/createReport",
        template: 2
    };
    */

    return (
        <div className="buttons-index">

            <Link to={promptVisible ? "" : "/loadReport"} >
                <button className="button-load-report">
                    <span>Load report file</span>
                </button>
            </Link>

            {/*
            <Link to={promptVisible ? "" : "/createReport"}>
                <button className="button-create-report" >
                    <span>Create report</span>
                </button>
            </Link>
            */}

            <hr></hr>
            <hr></hr>

            <h3>Templates</h3>

            <div className="wrapper" >

                <div className="template1">
                    <img className="template-img" src={process.env.PUBLIC_URL + '/template1.jpg'} alt="template_1" onClick={handleTemplateClick} />
                </div>

                <div className="template2">
                    <img className="template-img" src={process.env.PUBLIC_URL + '/template2.jpg'} alt="template_2" onClick={handleTemplateClick} />
                </div>

            </div>

            {promptVisible ? 
            (<CustomPrompt 
                onClose={handleClosePrompt}/>) 
            : 
            (<></>) }


        </div>
    );
}

export default Home; 