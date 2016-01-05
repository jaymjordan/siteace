Websites = new Mongo.Collection("websites");

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


if (Meteor.isClient) {

    //routes
    Router.configure({
    layoutTemplate: 'ApplicationLayout'
    });

    Router.route('/', function () {
        this.render('navbar', {
            to:"navbar"
        });
        this.render('home', {
            to:"main"
        });
    });

    Router.route('/sites', function () {
    this.render('navbar', {
            to:"navbar"
        });
        this.render('sites',{
            to:"main"
        });
    });

    Router.route('/sites/:_id', function () {

        this.render('navbar', {
                to:"navbar"
            });

        this.render('site', {
            data: function () {
                return Websites.findOne({_id: this.params._id});
            }
        }); 
    });

    Router.route('/search', function () {
        this.render('navbar', {
            to:"navbar"
        });
        this.render('searchPage', {
            to:"main"
        });

    });

    // Add username field to sign up form
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    });


    /* template helpers*/

    // helper function for EasySearch
    Template.searchBody.helpers({
      websitesIndex: () => WebsitesIndex
    });


    // helper function that returns all available websites
    Template.website_list.helpers({
        websites: function () {
            return Websites.find({}, {sort: {upvotes: -1}});
        }
    });

    Template.home.helpers({
        topRated: function () {
            return Websites.find({}, {sort: {upvotes: -1}, limit: 6});
        }
    });

    Template.registerHelper('formatDate', function (date) {
        return moment(date).format('DD-MM-YYYY');
    });
    /////
    // template events
    /////

    Template.website_item.events({
        "click .js-upvote": function (event) {

            var website_id = this._id;
            var user = Meteor.userId();
            var hasUpvoted = Websites.find({_id: website_id, upvotedBy: user}).count();

            // make sure a user hasn't voted before
            if (!hasUpvoted) {
                Websites.update({_id: website_id}, {
                    $push: {upvotedBy: user},
                    $pull: {downvotedBy: user},
                    $inc: {upvotes: 1}
                });
            }
            //alert("You have already voted this site up.\n\nYou are only allowed to vote once. Thanks!")
            return false; // prevent the button from reloading the page
        },

        "click .js-downvote": function (event) {
            var user = Meteor.userId();
            var website_id = this._id;
            var hasDownvoted = Websites.find({_id: website_id, downvotedBy: user}).count();

            // make sure a user hasn't voted before and upvotes value is more than zero
            if (!hasDownvoted && this.upvotes) {
                Websites.update({_id: website_id}, {
                    $push: {downvotedBy: user},
                    $pull: {upvotedBy: user},
                    $inc: {upvotes: -1}
                });
            }
            // alert("You have already voted this site down.\n\nYou are only allowed to vote once. Thanks!");
            return false; // prevent the button from reloading the page
        },
        "click a": function (event) {
            event.stopPropagation();
        }
    });

    Template.website_form.events({
        "click .js-toggle-website-form": function (event) {
            $("#website_form").toggle('slow');
        },
        "submit .js-save-website-form": function (event) {

            // here is an example of how to get the url out of the form:
            var url = 'http://' + event.target.url.value.replace(/^https?:\/\//, '');

            extractMeta(url, function (err, res) {
                var title = event.target.title.value,
                    description = event.target.description.value || res.description || res.title;

                var alertForm = document.getElementsByClassName('alert')[0];

                // Make url and title fields mandatory
                if (!url) {
                    alertForm.innerHTML = "You didn't enter the url!";
                    alertForm.style.display = 'block';
                    return false;
                } else if (!title) {
                    alertForm.innerHTML = "You didn't enter the title!";
                    alertForm.style.display = 'block';
                } else {
                    alertForm.style.display = 'none';
                    console.log(url);
                    Websites.insert({
                        title: title,
                        url: url,
                        description: description,
                        createdOn: new Date()
                    });
                }
                $("#website_form").toggle('slow');

            });
            return false; // stop the form submit from reloading the page
        },

        // Fill title and description fields on focus
        "focus #title": function () {
            var url = document.getElementById('url').value.replace('http://', '');
            extractMeta('http://' + url, function (err, res) {

                // Create a backup title extracted from the url
                url = 'www.' + url.replace('www.', '');
                var match = url.match(/\.([^.]+?)\./)[1],
                    backupTitle = match[0].toUpperCase() + match.slice(1, match.length);

                document.getElementById('title').value = res.title || backupTitle;
                document.getElementById('description').value = res.description || '';
            });
        }
    });

    Template.site.events({
        "click .js-add-comment": function (event) {

            var website_id = this._id;
            var comment = $('#comment').val();
            var username = Meteor.user() ? Meteor.user().username : 'Anonymous';
            console.log(username);
            Websites.update({_id: website_id}, {
                $push: {
                    comments: {
                        text: comment,
                        date: moment().format('MMM DD YYYY, h:mm:ss a'),
                        user: username
                    }
                }
            });
        }
    });

    Template.searchPage.events({
    "click .js-next":function(event) {
        var website_id =  event.currentTarget.id;
        var markPosition = website_id.indexOf('"');
        if(markPosition != -1) {
            website_id = website_id.substring(0, markPosition);
        }
        window.location.href = "/websites/" + website_id;
        }
    }); 
}



if (Meteor.isServer) {
    // start up function that creates entries in the Websites databases.
    Meteor.startup(function () {
        // code to run on server at startup
        if (!Websites.findOne()) {

            console.log("No websites yet. Creating starter data.");
            Websites.insert({
                title: "The Martini FAQ",
                url: "http://www.rdwarf.com/users/mink/martinifaq.html",
                description: extractMeta('http://www.rdwarf.com/users/mink/martinifaq.html').description || extractMeta('http://www.rdwarf.com/users/mink/martinifaq.html').title,
                createdOn: new Date(),
                upvotes: 8
            });
            Websites.insert({
                title: "Bartender Re-Education: The Old Fashioned",
                url: "https://caskstrength.wordpress.com/2011/08/31/bartender-re-education-the-old-fashioned/",
                description: extractMeta('https://caskstrength.wordpress.com/2011/08/31/bartender-re-education-the-old-fashioned/').description || extractMeta('https://caskstrength.wordpress.com/2011/08/31/bartender-re-education-the-old-fashioned/').title,
                createdOn: new Date(),
                upvotes: 7
            });
            Websites.insert({
                title: "Difford's Cocktail Guide - The Sazerac",
                url: "http://www.diffordsguide.com",
                description: extractMeta('http://www.diffordsguide.com').description || extractMeta('http://www.diffordsguide.com/cocktails/recipe/1752/sazerac-cocktail-diffords-recipe').title,
                createdOn: new Date(),
                upvotes: 10
            });
            Websites.insert({
                title: "The Best Amaretto Sour in the World",
                url: "http://www.jeffreymorgenthaler.com/2012/i-make-the-best-amaretto-sour-in-the-world/",
                description: extractMeta('http://www.jeffreymorgenthaler.com/2012/i-make-the-best-amaretto-sour-in-the-world/').description || extractMeta('http://www.jeffreymorgenthaler.com/2012/i-make-the-best-amaretto-sour-in-the-world/').title,
                createdOn: new Date(),
                upvotes: 3
            });
            Websites.insert({
                title: 'The Singapore Slingshot',
                url: 'https://spiritsandcocktails.wordpress.com/2009/01/25/singapore-slingshot/',
                description: extractMeta('https://spiritsandcocktails.wordpress.com/2009/01/25/singapore-slingshot/').description || extractMeta('https://spiritsandcocktails.wordpress.com/2009/01/25/singapore-slingshot/').title,
                createdOn: new Date(),
                upvotes: 9
            });
            Websites.insert({
                title: 'The Science of Barrel Aging',
                url: 'http://www.alcademics.com/2015/11/the-science-of-barrel-aging-on-popscicom.html',
                description: extractMeta('http://www.alcademics.com/2015/11/the-science-of-barrel-aging-on-popscicom.html').description || extractMeta('http://www.alcademics.com/2015/11/the-science-of-barrel-aging-on-popscicom.html').title,
                createdOn: new Date(),
                upvotes: 5
            });
        }
    });
}