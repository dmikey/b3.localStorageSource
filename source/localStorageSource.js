enyo.kind({
    name: "b3.localStorageSource",
    kind: "enyo.Source",
    fetch: function (rec, opts) {
        if (rec instanceof enyo.Model) {
            //fetch a record
            var _rec = JSON.parse(localStorage.getItem(opts.euid || rec.euid));
            rec.euid = opts.euid;
            rec.isNew = false;
            rec.setObject(_rec);
        } else {
            //fetch collection based on kindName passed,
            //or model attached to collection
            var model = opts.kindName || new rec.model().kindName;
            rec.removeAll();
            for (var i = 0; i < localStorage.length; i++) {
                var localKey = localStorage.key(i);
                if (model === localKey.substr(0, model.length)) {
                    var euid = localKey.substr(model.length + 1);
                    var _rec = JSON.parse(localStorage.getItem(localKey));
                    var _model = new rec.model().setObject(_rec);
                    _model.euid = euid;
                    _model.isNew = false;
                    rec.add(_model);
                };
            }
        }
        if (opts.success) {
            opts.success();
        }
    },
    commit: function (rec, opts) {
        rec.isNew = false;
        var key = rec.kindName + "_" + rec.euid
        localStorage.setItem(key, rec.toJSON());
    },
    destroy: function (rec, opts) {
        var euid = opts.euid || rec.euid;
        var key = rec.kindName + "_" + rec.euid
        localStorage.removeItem(key);
    },
});