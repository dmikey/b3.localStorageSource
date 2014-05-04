(function(){
    var enyoObject;
    /** 
     * Adds a wrapper function arround its `fn` parameter which runs 
     * the `fn` in a try/catch and calls the fail/success methods of 
     * `opts` object. Additionaly, logs the errors as warning, making 
     * aware the developer that an exception has occured since may not 
     * always be an fail handler available. This function is used to 
     * enhance the `fetch`, `commit`, `destroy` with such handlers. 
     * 
     * @param  {Function} fn The function we want to add fail/success handling.
     * @returns {Function} A new function which runs the `fn` in a try/catch and calls the fail/success methods.
     */
    function withErrorSuccess (fn){
        // Parameter check to be a function.
        if (typeof fn !== "function") {
            throw new Error("Function expected");
        }
        return function(rec, opts){
            try {
                // Arguments most likely be `(rec,opts)`
                fn.apply(this, arguments);
                if (opts.success) {
                    opts.success();
                }
            } catch (err) {
                enyo.warn(err);
                if (opts.fail) {
                    opts.fail(err);
                }
            }
        };
    }

    /**
     * Returns an euid.
     * @param  {Object} rec  The record we are working on.
     * @param  {Object} opts Any available options.
     * @return {String}      The euid.
     */
    function getEuid(rec, opts) {
        return opts.euid || rec.euid;
    }

    /**
     * Builds a key to be used from localStorage as a reference
     * to a set of data. The key is based on the record's `kind`
     * name and its `euid`.
     * 
     * @param  {Object} rec  The record we are working on.
     * @param  {Object} opts Any available options.
     * @return {String}      A string representing a localStorage key.
     */
    function buildLocalStorageKey(rec, opts) {
        return rec.kindName + "_" + getEuid(rec,opts);
    }

    enyoObject = {
        name: "b3.localStorageSource",
        kind: "enyo.Source",
        fetch: withErrorSuccess (function(rec,opts) {
            var key = buildLocalStorageKey(rec, opts);
            if (rec instanceof enyo.Model) {
                //fetch a record
                var _rec = JSON.parse(localStorage.getItem(key));
                rec.euid = getEuid(rec, opts);
                rec.isNew = false;
                rec.setObject(_rec);
            } else {
                //fetch collection based on kindName passed,
                //or model attached to collection
                var model = opts.kindName || rec.model.prototype.kindName;
                rec.removeAll();
                for (var i = 0; i < localStorage.length; i++) {
                    var localKey = localStorage.key(i);
                    if (model === localKey.substr(0, model.length)) {
                        var euid = localKey.substr(model.length + 1);
                        var _rec = JSON.parse(localStorage.getItem(localKey));
                        var _model = new rec.model(_rec);
                        _model.euid = euid;
                        _model.isNew = false;
                        rec.add(_model);
                    }
                }
            }
        }),
        commit: withErrorSuccess (function(rec,opts) {
            rec.isNew = false;
            var key = buildLocalStorageKey(rec, opts);
            localStorage.setItem(key, rec.toJSON());
        }),
        destroy: withErrorSuccess (function(rec, opts) {
            var key = buildLocalStorageKey(rec, opts);
            localStorage.removeItem(key);
        })
    };
    
    enyo.kind( enyoObject );
})();
