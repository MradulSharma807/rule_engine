# Rule Engine with Abstract Syntax Tree (AST)

## Overview
This project implements a simple 3-tier rule engine application to determine user eligibility based on various attributes such as age, department, income, and spending. The system uses an Abstract Syntax Tree (AST) to represent conditional rules and allows for the dynamic creation, combination, and modification of these rules.

## Features
- Create individual rules and represent them as ASTs.
- Combine multiple rules into a single AST.
- Evaluate rules against user data attributes.
- Error handling for invalid rule strings.
- Supports modifications of existing rules.

## Technologies Used
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **Frontend:** React.js
- **Database:** MongoDB


### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

-1. Clone the repository:
   git clone https://github.com/MradulSharma807/rule_engine.git
   cd rule_engine
-2.Navigate to the backend directory and install dependencies:
    cd backend
    npm install
-3.Navigate to the frontend directory and install dependencies:
    cd ../frontend
    npm install
   
Configuration
Ensure you have MongoDB running. Update the MongoDB connection string in the server.js file if necessary.
Set up any necessary environment variables (if applicable).

Running the Application
-1.Start the backend server:
   cd backend
   node server.js
-2.In another terminal, start the frontend application:
   cd frontend
   npm start


API Endpoints
POST /create_rule: Create a rule from a string and returns the corresponding AST.
POST /combine_rules: Combine multiple rules and returns a single AST.
POST /evaluate_rule: Evaluate the AST against user data.



Testing
You can run tests by implementing your test cases for the API endpoints and functionalities.

Contributing
If you'd like to contribute to this project, please fork the repository and submit a pull request.

License
This project is licensed under the MIT License.

Acknowledgments
Node.js
React.js
MongoDB
