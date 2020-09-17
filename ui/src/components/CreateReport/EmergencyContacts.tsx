import React from 'react'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

interface Props {
    onChange: any;
    value: any;
}

const EmergencyContacts: React.FC<Props> = (props: Props) => {

    return (
        <div className="emergency-contacts">
            <h4 className="title">Emergency Procedures / Contacts</h4>

            <SimpleMDE
                id="simplemde-emergency"
                onChange={props.onChange}
                value={props.value}
                options={{
                    autoDownloadFontAwesome: true,
                    spellChecker: false,
                    hideIcons: ["quote", "image", "side-by-side", "fullscreen", "guide"]
                }} />
        </div>
    );
}

export default EmergencyContacts;