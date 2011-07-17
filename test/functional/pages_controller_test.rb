require 'test_helper'

class PagesControllerTest < ActionController::TestCase
  test "should get home" do
    get :home
    assert_response :success
  end

  test "should get display_tweets" do
    get :display_tweets
    assert_response :success
  end

end
