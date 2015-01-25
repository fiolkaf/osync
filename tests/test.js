define(['unexpected'], function(expect) {

    describe('Test', function() {
        it('should be ok ', function() {
           expect('foo', 'not to be', 'bar');
        });
    });
});
