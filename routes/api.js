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
          res.send({error: "could not find project"})
        } else {
          const project_id = projectGroup[0].project_id
          console.log("project_id", projectGroup[0].project_id);
          const results = await Issue.find({
            project_id: project_id,
            ...cliQry
          });
          console.log("results", results)
          if (!results[0]) {
            res.send({error: "No results found"})
          }else { 
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
        console.log("project_name", project_name);

        const issue = new Issue({
          issue_title: data.issue_title,
          issue_text: data.issue_text,
          created_by: data.created_by,
          assigned_to: data.assigned_to,
          status_text: data.status_text,
          project_name: project_name.name,
          project_id: project_name._id
        });
        const result = await issue.save();
        console.log(result);
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

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
