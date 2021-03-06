Websites = new Mongo.Collection("websites");
Recipes = new Mongo.Collection("recipes");

Recipes.attachSchema(new SimpleSchema(
    description: {
        type: String,
        max: 2500
    },

}));    

// Set up EasySearch package
WebsitesIndex = new EasySearch.Index({
  collection: Websites,
  fields: ['title','url','description'],
  engine: new EasySearch.MongoDB()
});


// Set permissions for modifying the collection
Websites.allow({
    insert: function(userID, doc) {
        if(Meteor.user()) {
            return true;
        }
        return false;
    },
    remove: function(userID, doc) {
        if(Meteor.user()) {
            return true;
        }
        return false;
    },
    update: function(userID, doc) {
        if(Meteor.user()) {
            return true;
        }
        return false;
    }
});