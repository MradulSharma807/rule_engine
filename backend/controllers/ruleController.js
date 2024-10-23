const Rule = require('../models/Rule');

// Function to convert rule string to AST
const createRule = (ruleString) => {
    const tokens = tokenize(ruleString);
    const ast = parse(tokens);
    return ast;
};

// Tokenization function
const tokenize = (input) => {
    const regex = /\s*([()<>!=]=?|AND|OR|[A-Za-z_][A-Za-z0-9_]*|\d+|['"]?[^'"\s]+['"]?)\s*/g;
    const tokens = [];
    let match;
    while ((match = regex.exec(input))) {
        tokens.push(match[1]);
    }
    return tokens;
};

// Parsing function
const parse = (tokens) => {
    let current = 0;

    const parseExpression = () => {
        let left = parseTerm();

        while (current < tokens.length && (tokens[current] === 'AND' || tokens[current] === 'OR')) {
            const operator = tokens[current];
            current++;
            const right = parseTerm();
            left = { type: operator, left, right };
        }

        return left;
    };

    const parseTerm = () => {
        let token = tokens[current];

        if (token === '(') {
            current++;
            const expr = parseExpression();
            current++; // Skip ')'
            return expr;
        }

        if (isConditionStart(token)) {
            const condition = parseCondition();
            return condition;
        }

        throw new Error(`Unexpected token: ${token}`);
    };

    const parseCondition = () => {
        const left = tokens[current++];
        const operator = tokens[current++];
        const right = tokens[current++];

        return {
            type: 'condition',
            left: left,
            operator: operator,
            right: right
        };
    };

    const isConditionStart = (token) => {
        return /^[A-Za-z_][A-Za-z0-9_]*$/.test(token);
    };

    return parseExpression();
};

// Create a new rule
exports.createRule = (req, res) => {
    const { ruleString } = req.body;
    const ruleAST = createRule(ruleString);

    const newRule = new Rule({ ruleAST });
    newRule.save()
        .then(() => res.status(201).json({ message: 'Rule created successfully', ruleAST }))
        .catch(err => res.status(500).json({ message: 'Error creating rule', error: err }));
};

// Combine rules
const combineRulesAST = (ruleASTs) => {
    if (ruleASTs.length === 0) return null;
    let combinedAST = ruleASTs[0];

    for (let i = 1; i < ruleASTs.length; i++) {
        combinedAST = {
            type: "AND", // You can adjust the operator based on user preference (AND/OR)
            left: combinedAST,
            right: ruleASTs[i]
        };
    }

    return combinedAST;
};

// Combine rules handler
exports.combineRules = (req, res) => {
    const { rules } = req.body; // Array of rule ASTs

    // Log the received rules for debugging
    console.log('Received rules:', rules);

    // Validate input
    if (!Array.isArray(rules) || rules.length === 0) {
        return res.status(400).json({ message: 'Invalid input: Expected an array of rules.' });
    }

    try {
        let combinedAST = rules[0];

        for (let i = 1; i < rules.length; i++) {
            // Combine rules using AND operator (can be customized based on your needs)
            combinedAST = {
                type: "AND",
                left: combinedAST,
                right: rules[i]
            };
        }

        res.json({ combinedAST });
    } catch (error) {
        console.error('Error during combining rules:', error); // Log the actual error
        res.status(500).json({ message: 'Error combining rules', error });
    }
};
// Evaluate a rule
exports.evaluateRule = (req, res) => {
    const { ruleAST, data } = req.body;

    const evaluateAST = (node, data) => {
        if (Array.isArray(node)) {
            // If it's an array, evaluate each AST
            return node.some(ast => evaluateAST(ast, data));
        } else if (node.type === "condition") {
            const { left, operator, right } = node;
            const leftValue = data[left];

            // Handle the right value based on the operator
            let rightValue;
            if (operator === "=") {
                rightValue = right.replace(/'/g, "").trim(); // Remove quotes for string comparison
            } else {
                rightValue = parseFloat(right); // Convert to a number for numeric comparisons
            }

            switch (operator) {
                case '>':
                    return leftValue > rightValue;
                case '<':
                    return leftValue < rightValue;
                case '=':
                    return leftValue == rightValue; // Using == for comparison
                default:
                    return false;
            }
        } else if (node.type === "AND") {
            return evaluateAST(node.left, data) && evaluateAST(node.right, data);
        } else if (node.type === "OR") {
            return evaluateAST(node.left, data) || evaluateAST(node.right, data);
        }
        return false; // Fallback for unrecognized node types
    };

    const result = evaluateAST(ruleAST, data);
    res.json({ result });
};
