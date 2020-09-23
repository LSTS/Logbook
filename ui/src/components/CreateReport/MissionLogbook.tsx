import React, { useState } from 'react';
import { addZero } from '../../lib/utils';

interface Props {
    onAddMissionLog: any;
    onChangeMissionLog: any;
    onBlurMissionLog: any;
    onDeleteMissionLog: any;

    missionLog: {
        time: string,
        description: string
    }[];
}

const MissionLogbook: React.FC<Props> = (props: Props) => {

    const [logDescription, setLogDescription] = useState('');

    const handleChangeLog = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogDescription(event.target.value);
    }


    const handleInputAddLog = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.keyCode === 13 && logDescription.length !== 0) {
            props.onAddMissionLog(logDescription);
            setLogDescription('');
        }
    }


    const handleButtonAddLog = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (logDescription.length !== 0) {
            props.onAddMissionLog(logDescription);
            setLogDescription('');
        }
    }

    const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const elem = event.target;
        const logId = elem.getAttribute('data-log-id');
        const value = event.target.value;

        if (value.indexOf(':') !== -1) {
            const hours = value.substring(0, value.indexOf(':'));
            const minutes = value.substring(value.indexOf(':') + 1, value.length);

            let hoursToPresent;
            if (hours.length <= 2 && !hours.match("[a-zA-Z]+") && parseInt(hours) >= 0 && parseInt(hours) <= 23) {
                hoursToPresent = addZero(parseInt(hours)).toString();
            }
            else {
                hoursToPresent = '00';
                alert('Invalid format');
            }

            let minutesToPresent;
            if (minutes.length <= 2 && !minutes.match("[a-zA-Z]+") && parseInt(minutes) >= 0 && parseInt(minutes) <= 59) {
                minutesToPresent = addZero(parseInt(minutes)).toString();
            }
            else {
                minutesToPresent = '00';
                alert(alert('Invalid format'));
            }


            const timeUpdate = hoursToPresent + ':' + minutesToPresent;
            props.onBlurMissionLog(logId,timeUpdate)

        }
        else {
            console.log('invalid format');
            props.onBlurMissionLog(logId,'00:00')
        }
    }


    return (
        <div className="mission-logbook">
            <h4 className="title">Mission Logbook</h4>

            <table className="missionLog-table">
                <tbody className="missionLog-table-body">

                    {
                        props.missionLog.map((item, index) => (
                            <tr key={index} data-log={index} >
                                <td className="missionLog-table-time">

                                    <input type="text"
                                        className="missionLog-input-time"
                                        data-log-id={index}
                                        data-log-type="time"
                                        value={item.time}
                                        onChange={props.onChangeMissionLog}
                                        onBlur={handleOnBlur} />
                                    
                                </td>
                                
                                <td className="missionLog-table-description">

                                    <input type="text"
                                        className="missionLog-input-description"
                                        data-log-id={index}
                                        data-log-type="description"
                                        value={item.description}
                                        onChange={props.onChangeMissionLog}/>
                                    
                                    <button className="delete-log" 
                                        data-log-id={index} 
                                        onClick={props.onDeleteMissionLog}> 
                                
                                        &#x1f5d1;
                                
                                    </button> 

                                    <br></br>
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>

            <br></br>

            <div className="wrap-addMissionLog">
                <input
                    type="text"
                    className="input-addMisisonLog"
                    onChange={handleChangeLog}
                    onKeyDown={handleInputAddLog}
                    placeholder="Enter description"
                    value={logDescription} />

                <button className="button-addMissionLog" onClick={handleButtonAddLog}> Add Log </button>

            </div>

        </div>
    );
}

export default MissionLogbook;