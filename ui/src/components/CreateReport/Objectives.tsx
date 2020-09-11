import React from 'react'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

interface Props {
    onChange: any;
    value: any;
}

const Objectives: React.FC<Props> = (props: Props) => {

    return (
        <div className="objectives">
            <h4 className="title">Objectives</h4>

            <SimpleMDE
                id="simplemde-objectives"
                onChange={props.onChange}
                value={props.value} 
                options = {{ 
                    spellChecker: false
                }}/>

        </div>
    );





}

export default Objectives;