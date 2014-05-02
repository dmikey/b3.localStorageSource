b3.localStorageSource
=====================

An EnyoJS Local Storage Source component, to give Models, and Collections the ability to read and store from plain window.localStorage.

* Use for quick local storage
* Great for state saving
* Plugs directly into enyo.Model and enyo.Collection

How to Use
=====================

Include the script with your EnyoJ S application through package.js , or insert into the HTML page with a script tag.

Insert with HTML

    <script src="b3.localStorageSource.min.js"></script>

Insert with package.js

    enyo.depends("b3.localStorageSource");

Add the New source to the global Enyo Store (enyo.store), or to your applications custom store.

    enyo.store.addSources({local: "b3.localStorageSource"});

Set a model or collection to use the local as the default store (or specify the store in the options, when doing data methods)

    enyo.kind({
        name: "TestModel",
        kind: "enyo.Model",
        defaultSource: "local",
    });

    enyo.kind({
        name: "TestCollection",
        kind: "enyo.Collection",
        model: "TestModel",
        defaultSource: "local",
    });

That's it! Now models will save or fetch from localStorage, and collections will fetch!

    //have a model fetch state localStorage using its current euid
    model.fetch();

    //provide a euid to populate from localStorage
    model.fetch({euid:"98b03d-b93d-45ef45af-41723f5fe63"});

    //have a model commit to local storage
    model.commit();

    //get a collection by attached enyo.Model, or all generic euids
    collection.fetch({
    success:function(){
            collection.destroyAll();
        }
    });

Notes
=====================

* A Collection doesn't need to have a model attached, but having a model allows localStorageStore to seperate out model instances, and populate Collections with specific sets of models.
* Incomplete implimentation as of today, not all enyo.Source methods have been stubbed.