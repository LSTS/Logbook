import React, { useState } from 'react';

interface Props {
    fileName: string;
    onChangeFile: any;
    onClose: any;
}

const CustomPrompt: React.FC<Props> = (props: Props) => {

    const [error, setError] = useState<string>('');
    const [errorVisible, setErrorVisible] = useState<boolean>(false);


    const handleCreateBtn = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        if (/\s/.test(props.fileName)) {
            //alert("Invalid file name:\n Whitespaces ara not allowed.");
            setError("Invalid file name:\n Whitespaces ara not allowed.");
            setErrorVisible(true);
        }
        else if (props.fileName.startsWith('debriefing_') && props.fileName.endsWith('.md')) {
            console.log("Check if file already exist " +  props.fileName);

            //check file template
            const dataFetched = await fetch('http://localhost:3001/file/exist/' + props.fileName);
            const fileExist = await dataFetched.json();
            console.log(fileExist.result);
            
            if(fileExist.result) {
                setErrorVisible(false);
                alert('Create report.\nWork in progress...');
            }
            else {
                console.log("existe");
                setError('File with that name already exists...');
                setErrorVisible(true);
            }
        }
        else {
            setError("Invalid syntax");
            setErrorVisible(true);
        }

    }

    return (
        <div className="prompt-filename" onBlur={props.onClose}>
            <h4 className="prompt-title">The report for the current day already exist.</h4>
            <hr></hr>
            <p className="prompt-info">Please open/edit from the page "Load Reports"</p>

            <p className="prompt-info">In order to create a new report, please keep the syntax file name:</p>


            <input type="text"
                className="prompt-input"
                placeholder="debriefing_2020-01-01.md"
                defaultValue={props.fileName}
                onChange={props.onChangeFile}
            />

            {errorVisible ? (<span className="tooltip">{error}</span>) : (<></>)}

            <div className="prompt-btns">
                <button className="prompt-close" onClick={props.onClose}> Close </button>
                <button className="prompt-create" onClick={handleCreateBtn}> Create </button>
            </div>

        </div>
    );
}

export default CustomPrompt;