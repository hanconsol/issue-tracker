'use strict';
const Issue = require('../models/issue.model.js');
const Project = require('../models/project.model.js');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      let project = req.params.project;
      let cliQry = req.query;

      console.log("get-project", project, "query", cliQry);
      try {
        const projectGroup = await Issue.find({ project_name: project });

        if (!projectGroup[0]) {
          res.send({ error: "could not find project" })
        } else {
          const project_id = projectGroup[0].project_id
          console.log("project_id", projectGroup[0].project_id);
          const results = await Issue.find({
            project_id: project_id,
            ...cliQry
          });
          // console.log("results", results)
          if (!results[0]) {
            res.send({ error: "No results found" })
          } else {
            res.send(results);
          }
        }
      }
      catch (error) {
        console.log(error)
      }
    })
    //  app.route('/api/issues/:project') 
    .post(async function (req, res) {
      const { project } = req.params;
      let data = req.body;
      console.log("project", project, "data", data);
      if (!data.issue_title || !data.issue_text || !data.created_by) {
        res.send({ error: 'required field(s) missing' });
        return;
      }
      try {
        let project_name = await Project.findOne({ name: project });
        if (!project_name) {
          project_name = await Project.create({ name: project });
        }
        console.log("POST project_name", project_name);
        const issue = new Issue({
          issue_title: data.issue_title,
          issue_text: data.issue_text,
          created_by: data.created_by,
          assigned_to: data.assigned_to,
          status_text: data.status_text,
          project_name: project_name.name,
          project_id: project_name._id,

        });
        const result = await issue.save();
        console.log("POST result", result);
        res.send({
          issue_title: result.issue_title,
          issue_text: result.issue_text,
          created_by: result.created_by,
          assigned_to: result.assigned_to,
          status_text: result.status_text,
          created_on: result.created_on,
          updated_on: result.updated_on,
          open: result.open,
          _id: result._id
        })
      }
      catch (error) {
        console.log(error)
      }


    })

    .put(async function (req, res) {
      let { project } = req.params;
      let cliQry = req.body;
      console.log("PUT project", project,)
      console.log("PUT req.body - cliQry", cliQry)
      const { _id } = req.body;
      try {
        if (!_id) {
          res.send({ error: 'missing _id' });
          return;
        }
        if (!cliQry.issue_title && !cliQry.issue_text && !cliQry.created_by && !cliQry.assigned_to && !cliQry.status_text && !cliQry.open) {
          res.send({ error: 'no update field(s) sent', '_id': _id });
          return;
        }
        const updatedIssue = await Issue.findByIdAndUpdate(
          _id,
          {
            ...cliQry,
            updated_on: new Date()
          },
          { new: true }
        );
        console.log("PUT updatedIssue", updatedIssue);
        if (!updatedIssue) {
          return res.send({ error: 'could not update', '_id': _id })
        } else {
          console.log("_id", _id)
          res.send({ result: 'successfully updated', '_id': _id });
        }
      } catch (err) {
        res.send({ error: 'could not update', '_id': _id });
        console.log(err);
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      try {
        const { _id } = req.body;
        if (!_id) {
          res.send({ error: 'missing _id' });
          return;
        }
        console.log(_id)
        const result = await Issue.findByIdAndDelete(_id);
        if (!result) {
          return res.send({ error: 'could not delete', '_id': _id })
        }
        res.send({ result: 'successfully deleted', '_id': _id });
      } catch (error) {
        res.send({ message: error.message });
      }
    });




};
