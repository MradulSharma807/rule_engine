    
const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    ruleAST: {
        type: Object,
        required: true,
    }
});

module.exports = mongoose.model('Rule', ruleSchema);
