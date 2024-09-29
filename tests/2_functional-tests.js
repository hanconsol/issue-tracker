const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
chai.use(chaiHttp);
let issueIdToUpdate;
let issueIdToDelete;


suite('Functional Tests', function () {
    suite(' POST request to /api/issues/{project}', () => {

        test('Create an issue with every field', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/TEST')
                .send({
                    issue_title: 'Test1',
                    issue_text: 'Post it',
                    created_by: 'tester 1',
                    assigned_to: 'tester 2',
                    status_text: 'in progress'
                })
                .end(function (err, res) {
                    issueIdToUpdate = res.body._id;
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Test1');
                    assert.equal(res.body.issue_text, 'Post it');
                    assert.equal(res.body.created_by, 'tester 1');
                    assert.equal(res.body.assigned_to, 'tester 2');
                    assert.equal(res.body.status_text, 'in progress');
                    assert.equal(res.body.open, true);
                });
            done();
        });
        test('Create an issue with only required fields', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/TEST')
                .send({
                    issue_title: 'Test2',
                    issue_text: 'Post it',
                    created_by: 'tester 1',
                })
                .end(function (err, res) {
                    //  console.log(res);
                    issueIdToDelete = res.body._id;
                    console.log("issueIdToDelete", issueIdToDelete);
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Test2');
                    assert.equal(res.body.issue_text, 'Post it');
                    assert.equal(res.body.created_by, 'tester 1');
                    assert.equal(res.body.assigned_to, '');
                    assert.equal(res.body.status_text, '');
                    assert.equal(res.body.open, true);
                });
            done();
        });
        test('Create an issue with missing required fields', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/TEST')
                .send({
                    issue_title: 'Test3',
                    issue_text: '',
                    created_by: ''
                })
                .end(function (err, res) {
                    // console.log(res);
                    assert.equal(res.status, 200);
                    assert.equal(res.text, '{"error":"required field(s) missing"}');
                })
            done();
        });
    });
    suite(' GET request to /api/issues/{project}', () => {
        test('View issues on a project', (done) => {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/TEST')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                });
            done();

        });

        test('View issues on a project with one filter', (done) => {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/TEST?created_by=tester 1')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                });
            done();

        });
        test('View issues on a project with multiple filters', (done) => {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/TEST?created_by=tester 1&issue_title=Test2')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                });
            done();
        });
    });
    suite('PUT request to /api/issues/{project}', () => {
        test('Update one field on an issue', (done) => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/TEST')
                .send({
                    _id: issueIdToUpdate,
                    issue_title: 'UpdatedTest1',
                })
                .end(function (err, res) {
                    // console.log(res);
                    assert.equal(res.status, 200);
                    assert.equal(res.text, `{"result":"successfully updated","_id":"${issueIdToUpdate}"}`);
                });
            done()
        });
        test('Update multiple fields on an issue', (done) => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/TEST')
                .send({
                    _id: issueIdToUpdate,
                    issue_title: 'UpdatedTest2',
                    issue_text: 'Updated Post it',
                    created_by: 'Updated tester 1',
                    assigned_to: 'Updated tester 2',
                    status_text: 'Updated in progress'
                })
                .end(function (err, res) {
                    // console.log(res);
                    assert.equal(res.status, 200);
                    assert.equal(res.text, `{"result":"successfully updated","_id":"${issueIdToUpdate}"}`);

                });
            done()
        });
        test('Update an issue with missing _id', (done) => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/TEST')
                .send({
                    _id: '',
                    issue_title: 'UpdatedTest2',
                    issue_text: 'Updated Post it',
                    created_by: 'Updated tester 1',
                    assigned_to: 'Updated tester 2',
                    status_text: 'Updated in progress'
                })
                .end(function (err, res) {
                    // console.log(res);
                    assert.equal(res.status, 200);
                    assert.equal(res.text, '{"error":"missing _id"}');
                });
            done()
        });
        test('Update an issue with no fields to update', (done) => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/TEST')
                .send({
                    _id: issueIdToUpdate,
                    issue_title: '',
                    issue_text: '',
                    created_by: '',
                    assigned_to: '',
                    status_text: ''
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, `{"error":"no update field(s) sent","_id":"${issueIdToUpdate}"}`);
                });
            done()
        });
        test('Update an issue with an invalid _id', (done) => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/TEST')
                .send({
                    _id: '4047b3b1b3271872e9ded404',
                    issue_title: 'UpdatedTest2',
                    issue_text: 'Updated Post it',
                    created_by: 'Updated tester 1',
                    assigned_to: 'Updated tester 2',
                    status_text: 'Updated in progress'
                })
                .end(function (err, res) {
                    // console.log(res);
                    assert.equal(res.status, 200);
                    assert.equal(res.text, '{"error":"could not update","_id":"4047b3b1b3271872e9ded404"}');
                });
            done()
        });
    });
    suite('DELETE request to /api/issues/{project}', () => {
        test('Delete an issue', (done) => {
            console.log("issueIdToDelete in delete suite", issueIdToDelete);
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/TEST')
                .send({
                    _id: issueIdToDelete,
                })
                .end(function (err, res) {
                    // console.log(res);
                    assert.equal(res.status, 200);
                    assert.equal(res.text, `{"result":"successfully deleted","_id":"${issueIdToDelete}"}`);
                });
            done();
        });

        test('Delete an issue with an invalid _id', (done) => {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/TEST')
                .send({
                    _id: '4047b3b1b3271872e9ded404',
                })
                .end(function (err, res) {
                    // console.log(res);
                    assert.equal(res.status, 200);
                    assert.equal(res.text, '{"error":"could not delete","_id":"4047b3b1b3271872e9ded404"}');

                });
            done();
        });
        test('Delete an issue with missing _id', (done) => {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/TEST')
                .send({
                    _id: '',
                })
                .end(function (err, res) {
                    // console.log(res);
                    assert.equal(res.status, 200);
                    assert.equal(res.text, '{"error":"missing _id"}');

                });
            done();
        });
    });
});
