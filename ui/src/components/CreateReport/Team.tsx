import React from 'react'
import { presentTeamMembers } from '../../lib/utils';

import teamOptions from '../data/team.json';

interface Props {
    onChange: any;
    teamSelected: string[];
    onAddTeamMember: any;
    onDeleteTeamMember: any;
}


const Team: React.FC<Props> = (props: Props) => {

    // present team selected
    const presentString = presentTeamMembers(props.teamSelected);

    return (
        <div className="team">
            <h4 className="title">Team</h4>

            <h4 className="team-selected">
                {presentString.length > 0 ? ( presentString ) : ( 'N/D' )}
            </h4>


            <datalist id="team">
                {
                    teamOptions.map((team, index) => (
                        <option key={index}>{team}</option>
                    ))
                }
            </datalist>

            <ul className="team-ul">
                {
                    props.teamSelected.map((name, index) => (

                        <li key={index} className="team-item">
                            <input key={index} type="text"
                                className="team-input"
                                list="team"
                                data-member={index}
                                value={name}
                                onChange={props.onChange} />
                            
                               <button className="delete-team" 
                                    data-member={index} 
                                    onClick={props.onDeleteTeamMember}> 
                                
                                &#x2715;
                                
                                </button> 
                        </li>   
                    ))
                }
            </ul>

            <button onClick={props.onAddTeamMember}>Add team member</button>

        </div>
    );
}

export default Team;