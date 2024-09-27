const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({

    issue_title: {
        type: String,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    }, 
    created_by: {
        type: String, 
        required: true
    },
     assigned_to: {
        type: String,
        default: "",
        required: false 
     },
     status_text: {
        type: String,
        default: "",
        required: false
     },
     created_on: {
        type: Date,
        default: Date.now
     },
     updated_on: {
        type: Date,
        default: Date.now
     }, 
     open: {
        type: Boolean,
        default: true
     },
     project_name: {
      type: String,
      required: false
     },
     project_id: {
      type: String, 
      required: false
     }

});

const Issue = mongoose.model('Issue', IssueSchema);




module.exports = Issue;

// 2. You can send a POST request to /api/issues/{projectname} with form data containing the required fields issue_title, issue_text, created_by, and optionally assigned_to and status_text.
// 3. The POST request to /api/issues/{projectname} will return the created object, and must include all of the submitted fields. Excluded optional fields will be returned as empty strings. Additionally, include created_on (date/time), updated_on (date/time), open (boolean, true for open - default value, false for closed), and _id.