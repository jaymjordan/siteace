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