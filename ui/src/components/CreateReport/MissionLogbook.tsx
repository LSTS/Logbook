import React, { useState } from 'react';

interface Props {
    onAddMissionLog: any;

    missionLog: {
        time: string,
        description: string
    }[]
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


    return (
        <div className="mission-logbook">
            <h4 className="title">Mission Logbook</h4>

            <table className="missionLog-table">
                <tbody className="missionLog-table-body">

                    {
                        props.missionLog.map((item, index) => (
                            <tr key={index} data-log={index} >
                                <td className="missionLog-table-time">{item.time}</td>
                                <td className="missionLog-table-description">{item.description}</td>
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

                <button className="button-addMissionLog" onClick={handleButtonAddLog}>Add Log</button>

            </div>

        </div>
    );
}

export default MissionLogbook;