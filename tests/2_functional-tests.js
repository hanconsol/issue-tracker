const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

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
                    // console.log(res);
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Test1');
                    assert.equal(res.body.issue_text, 'Post it');
                    assert.equal(res.body.created_by, 'tester 1');
                    assert.equal(res.body.assigned_to, 'tester 2');
                    assert.equal(res.body.status_text, 'in progress');
                    assert.equal(res.body.open, true);
                });
            done()
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
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Test2');
                    assert.equal(res.body.issue_text, 'Post it');
                    assert.equal(res.body.created_by, 'tester 1');
                    assert.equal(res.body.assigned_to, '');
                    assert.equal(res.body.status_text, '');
                    assert.equal(res.body.open, true);
                });
            done()
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
    })
});
