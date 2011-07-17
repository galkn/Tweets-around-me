class TwitterController < ApplicationController
  
  def get_tweets
    @tweets = open "http://search.twitter.com/search.json?q=Twitter%20API&result_type=mixed&count=5"
    respond_to do |format|
      format.js
    end
  end

end
