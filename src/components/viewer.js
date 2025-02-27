import React from 'react';

let mentions = {};
function renderText(data, settings) {
    // Render text
    let text = data.text;
    text = text.split('\n').map((item, index, array) => (
        <React.Fragment key={index}>
            {item}
            {index < array.length - 1 && <br />}
        </React.Fragment>
    ));

    if (settings.bold || data.bold) {
        text = <strong>{text}</strong>;
    }
    if (settings.underline || data.underline) {
        text = <u>{text}</u>;
    }
    if (settings.italics || data.italics) {
        text = <em>{text}</em>;
    }
    

    //console.log('rendering: ', text);
    return text;
    
}

const renderRecursive = (data, settings) => {
    // For lists of stuff (like in the root of the JSON)
    if (Array.isArray(data)) {
        return data.map((item, index) => (
            <React.Fragment key={index}>
                {renderRecursive(item, settings)}
            </React.Fragment>
        ));
    }

    // Base case:  If there are no children, just return rendered text.  
    // You could add behavior here for rendering images or other types of data if it is present
    if (!data.children) {
        return renderText(data, settings);
    }
    else{
        // Update text settings
        if (data.bold) {
            settings.bold = true;
        }
        if (data.underline) {
            settings.underline = true;
        }
        if (data.italics) {
            settings.italics = true;
        }

        if (data.type === 'mention') {
            // Render a mention
            const Tag = data.type
            // Ignoring value tag as the children allow for more complex values
            if (mentions[data.id]) {
                // First mention dominates
                return (
                    <Tag style={{ backgroundColor: data.color }} title={data.title}>
                        {mentions[data.id]}
                    </Tag>
                );
            } else {
                mentions[data.id] = data.children.map((child, index) => (
                    <React.Fragment key={index}>
                        {renderRecursive(child, settings)}
                    </React.Fragment>
                ));
                // Nothing is currently done with variable type as no functionality was defined
                // Background color is not currently saved to the mentions object, though it could be
                // Styles like bold and underline are not carried to mentions to make them pop more, but that could be changed
                return (
                    <Tag style={{ backgroundColor: data.color }} title={data.title} variableType={data.variableType}>
                        {mentions[data.id]}
                    </Tag>
                );
            }
        } else if (data.type === 'clause') {
            // Render a clause
            const Tag = data.type
            let clauseCounter = settings.clauseCounter + 1;
            settings.clauseCounter = 0; // Reset clause counter to zero for subclauses
            settings.subclauseLevel += 1; // Can provide custom styling for subclauses if wanted
            let childrenTags = (
                <Tag title={`${data.title}`} style={{ display: 'block', marginLeft: `${(settings.subclauseLevel - 1) * 20}px` }}>
                    {clauseCounter}.&nbsp;
                    {data.children.map((child, index) => (
                        <React.Fragment key={index}>
                            {renderRecursive(child, settings)}
                        </React.Fragment>
                    ))}
                </Tag>
            );
            settings.clauseCounter = clauseCounter;
            settings.subclauseLevel -= 1;
            return childrenTags;
        } else {
            // Render a generic html tag
            const Tag = data.type;
            return (
                <Tag title={data.title}>
                    {data.children.map((child, index) => (
                        <React.Fragment key={index}>
                            {renderRecursive(child, settings)}
                        </React.Fragment>
                    ))}
                </Tag>
            );
        }
    }


};

const JsonViewer = ({ data }) => {

    
    if (!data) {
        return <div style={{ textAlign: 'center' }}>No data yet</div>;
    }
    const parsedData = JSON.parse(data);
    mentions = {};
    const settings = {
        bold: false,
        underline: false,
        italics: false,
        clauseCounter: 0,
        subclauseLevel: 0,
    };
    
    const renderedData = renderRecursive(parsedData, settings);

    return (
        <div class="contract-viewing">
            {renderedData}
        </div>
    );
};

export default JsonViewer;