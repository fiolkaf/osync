define(function(require){

    function Disposable(target) {
       if (target.dispose !== undefined) {
           throw '"dispose" method already defined';
       }

       var _disposers = [];
       target.addDisposer = function(disposer) {
           _disposers.push(disposer);
       };

       target.dispose = function() {
           _disposers.forEach(function(disposer) {
               disposer();
           });
       };

       return target;
    }

    return {
        mixin: Disposable
    };
});
