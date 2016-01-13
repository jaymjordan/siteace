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
