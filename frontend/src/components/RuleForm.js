
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RuleForm = () => {
    const [ruleString, setRuleString] = useState('');
    const [createdRules, setCreatedRules] = useState([]); // Store multiple rules
    const [combinedRule, setCombinedRule] = useState(null); // For combined AST
    const [evaluationData, setEvaluationData] = useState('');
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState(''); // For success message

    // Handle the creation of individual rules
    const handleCreateRule = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/rules/create', {
                ruleString
            });
            console.log("Response from server:", response.data);
            setCreatedRules([...createdRules, response.data.ruleAST]); // Add rule to the array
            setRuleString('');

            // Show notification when the first rule is created
            if (createdRules.length === 0) {
                setNotification('Rule has been created. To combine, create more rules.');
                setTimeout(() => {
                    setNotification(''); // Clear message after 5 seconds
                }, 5000);
            }
        } catch (error) {
            console.error('Error creating rule:', error);
        }
    };

    // Handle combining of rules
    const handleCombineRules = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/rules/combine', {
                rules: createdRules
            });
            console.log("Combined AST:", response.data);
            setCombinedRule(response.data.combinedAST);
            setError(''); // Clear any previous errors
        } catch (error) {
            console.error('Error combining rules:', error);
            setError('Error combining rules');
        }
    };

    // Handle rule evaluation
    const handleEvaluateRule = async (e) => {
        e.preventDefault();
        try {
            const data = JSON.parse(evaluationData);
            const response = await axios.post('http://localhost:3000/api/rules/evaluate', {
                ruleAST: combinedRule || createdRules[0], // Evaluate combined or first rule
                data
            });
            setEvaluationResult(response.data.result);
            setError('');
        } catch (error) {
            console.error('Error evaluating rule:', error);
            setError('Invalid JSON input. Please correct it.');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', maxWidth: '1200px', margin: 'auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Rule Creation and Evaluation</h2>

            {/* Notification for creating the first rule */}
            {notification && (
                <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
                    {notification}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Left side: Create Rule Section */}
                <div style={{ flex: 1, marginRight: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ color: '#007bff' }}>Create Rule</h3>
                    <form onSubmit={handleCreateRule}>
                        <input
                            type="text"
                            value={ruleString}
                            onChange={(e) => setRuleString(e.target.value)}
                            placeholder="Enter rule string"
                            style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
                        />
                        <button type="submit" style={{ padding: '10px', width: '100%', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Create Rule
                        </button>
                    </form>

                    {createdRules.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h4>Created Rule ASTs:</h4>
                            {createdRules.map((rule, index) => (
                                <pre key={index} style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd' }}>
                                    {JSON.stringify(rule, null, 2)}
                                </pre>
                            ))}
                        </div>
                    )}

                    {/* Combine rules button */}
                    {createdRules.length > 1 && !combinedRule && (
                        <button
                            onClick={handleCombineRules}
                            style={{ padding: '10px', width: '100%', marginTop: '20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Combine and Evaluate
                        </button>
                    )}

                    {/* Show combined rule if created */}
                    {combinedRule && (
                        <div style={{ marginTop: '20px' }}>
                            <h4>Combined Rule AST:</h4>
                            <pre style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd' }}>
                                {JSON.stringify(combinedRule, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Right side: Evaluate Rule Section */}
                <div style={{ flex: 1, marginLeft: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ color: '#28a745' }}>Evaluate Rule</h3>
                    <form onSubmit={handleEvaluateRule}>
                        <textarea
                            rows="5"
                            placeholder='Enter JSON data (e.g. {"age": 35, "department": "Sales", "salary": 60000, "experience": 3})'
                            value={evaluationData}
                            onChange={(e) => setEvaluationData(e.target.value)}
                            style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
                        />
                        <button type="submit" style={{ padding: '10px', width: '100%', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Evaluate Rule
                        </button>
                    </form>

                    {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                    {evaluationResult !== null && (
                        <div style={{ marginTop: '20px', fontSize: '20px', color: evaluationResult ? 'green' : 'red' }}>
                            Result: {evaluationResult ? 'Condition met!' : 'Condition not met!'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RuleForm;




