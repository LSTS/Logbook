import React, { useState, useRef } from 'react';

import packageJson from '../../../package.json';
const API_URL = packageJson.proxy

interface Props {
    onClose: any;
}


const CustomPrompt: React.FC<Props> = (props: Props) => {

    const [fileName,setFileName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [errorVisible, setErrorVisible] = useState<boolean>(false);
    const btnCreate = useRef<HTMLButtonElement>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(event.target.value);
    }

    const handleInputClick = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13 && fileName.length > 0) {
            if(btnCreate.current !== null){
                btnCreate.current.click();
            }
        }
    }

    const handleCreateBtn = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        //console.log('handle create report -> ' + fileName);

        if (/\s/.test(fileName)) {
            setError("Invalid file name: Whitespaces ara not allowed.");
            setErrorVisible(true);
        }
        else if (fileName.startsWith('debriefing_') && fileName.endsWith('.md')) {

            //check file template
            const dataFetched = await fetch(API_URL + '/file/exist/' + fileName);
            const fileExist = await dataFetched.json();
            
            if(fileExist.result) {
                setError('File with that name already exists...');
                setErrorVisible(true);
            }
            else {
                alert('Create report.\nWork in progress...');
                setErrorVisible(false);
                props.onClose();
            }
        }
        else {
            setError("Invalid syntax");
            setErrorVisible(true);
        }  
    }

    return (
        <div className="prompt-filename" >
            <h4 className="prompt-title">The report for the current day already exist.</h4>
            <hr></hr>
            <p className="prompt-info">Please open/edit from the page "Load Reports"</p>
            <p className="prompt-info" >In order to create a new report, please keep the syntax file name:</p>

            <input type="text"
                className="prompt-input"
                placeholder="debriefing_2020-01-01.md"
                defaultValue={fileName}
                onChange={handleFileChange}
                onKeyDown={handleInputClick}
                autoFocus />

            {errorVisible ? (<span className="tooltip">{error}</span>) : (<></>)}

            <div className="prompt-btns">
                <button className="prompt-close" onClick={props.onClose}> Close </button>
                <button className="prompt-create" onClick={handleCreateBtn} ref={btnCreate}>  Create </button>
            </div>

        </div>
    );
}

export default CustomPrompt;