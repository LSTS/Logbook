import React from 'react'
import { presentTeamMembers } from '../../lib/utils';

import teamOptions from '../data/team.json';

interface Props {
    onChange: any;
    teamSelected: string[];
}


const Team: React.FC<Props> = (props: Props) => {

    /*
    const [teamOptions, setTeamOptions] = useState([]);

    useEffect(() => {
        getTeamListFromServer();
    }, []);

    const getTeamListFromServer = () => {
        fetch('http://localhost:3001/team/')
            .then(res => res.json())
            .then(
                (result) => {
                    setTeamOptions(result.team);
                }
            )
    }
    */


    // present team selected
    const presentString = presentTeamMembers(props.teamSelected);


    return (
        <div className="team">
            <h4 className="title">Team</h4>



            <h4 className="team-selected">

                {presentString.length > 0 ? (<ul><li>{presentString}</li></ul>) : (<ul> <li>N/D</li></ul>)}

            </h4>

            <div className="team-checkboxes">
                {
                    teamOptions.map((member, index) => (


                        <label key={index} className="checkbox-wrap">

                            <input type="checkbox"
                                value={index}
                                name={member}
                                onChange={props.onChange}
                                checked={props.teamSelected.includes(member)} />

                            {member}
                            
                        </label>

                    ))
                }
            </div>

        </div>
    );
}

export default Team;