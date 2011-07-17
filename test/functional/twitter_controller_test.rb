require 'test_helper'

class TwitterControllerTest < ActionController::TestCase
  test "should get get_tweets" do
    get :get_tweets
    assert_response :success
  end

end
