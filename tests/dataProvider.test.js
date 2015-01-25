define([], function() {
    var todoList;

    NSync.createModel('todo', properties);
    new NSync.LocalStoreProvider(NSync.Models.Todo);
    new NSync.Receiver(NSync.Models.Todo).getAll().then(function(model) {
        todoList = model;
        todoList.on('change', component.render);
    });

    component.on('addItem', function() {
        var model = new Models.Todo({
            // _uri = /todos/{0}
        });
        model.name = 'test';
        todoList.add(model);
    })
});