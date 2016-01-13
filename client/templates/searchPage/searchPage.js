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

    // helper function for EasySearch
    Template.searchBody.helpers({
      websitesIndex: () => WebsitesIndex
    });
