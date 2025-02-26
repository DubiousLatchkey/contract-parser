import React from 'react';

let clauseCounter = 0;
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

    // Base case:  If there are no children, just return this simple object
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
            const Tag = data.type
            if (mentions[data.id]) {
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
                return (
                    <Tag style={{ backgroundColor: data.color }} title={data.title}>
                        {mentions[data.id]}
                    </Tag>
                );
            }
        } else if (data.type === 'clause') {
            const Tag = data.type
            clauseCounter++;
            return (
                <Tag description={`${data.title}`} style={{ display: 'block' }}>
                    {clauseCounter}.&nbsp;
                    {data.children.map((child, index) => (
                        <React.Fragment key={index}>
                            {renderRecursive(child, settings)}
                        </React.Fragment>
                    ))}
                </Tag>
            );
        } else {

            const Tag = data.type;
            return (
                <Tag description={data.title}>
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
        return <div>No data available</div>;
    }
    const parsedData = JSON.parse(data);
    clauseCounter = 0;
    mentions = {};
    const settings = {
        bold: false,
        underline: false,
        italics: false,
    };
    
    const renderedData = renderRecursive(parsedData, settings);

    return (
        <div class="contract-viewing">
            {renderedData}
        </div>
    );
};

export default JsonViewer;