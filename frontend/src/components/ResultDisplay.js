import React from 'react';

const ResultDisplay = ({ result }) => {
    return (
        <div style={{ marginTop: '20px', fontSize: '20px', color: result ? 'green' : 'red' }}>
            Result: {result ? 'Condition met!' : 'Condition not met!'}
        </div>
    );
};

export default ResultDisplay;