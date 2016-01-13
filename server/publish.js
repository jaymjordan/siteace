Meteor.publish('websites', function(){
  return Websites.find();
});