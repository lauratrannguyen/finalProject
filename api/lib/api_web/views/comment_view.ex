# BASED ON NAT TUCK'S GITHUB, and other homeworks
defmodule ApiWeb.CommentView do
  use ApiWeb, :view
  alias ApiWeb.CommentView

  def render("index.json", %{comments: comments}) do
    %{data: render_many(comments, CommentView, "no_assoc_comment.json")}
  end

  def render("show.json", %{comment: comment}) do
    %{data: render_one(comment, CommentView, "comment.json")}
  end

  def render("no_assoc_show.json", %{comment: comment}) do
    %{data: render_one(comment, CommentView, "no_assoc_comment.json")}
  end

  def render("comment.json", %{comment: comment}) do
    place_json = ApiWeb.PlaceView.render("show.json", place: comment.place)
    user_json = ApiWeb.UserView.render("no_assoc_show.json", user: comment.user)
    
    %{id: comment.id,
      text: comment.text,
      user: user_json,
      place: place_json}
  end

  def render("no_assoc_comment.json", %{comment: comment}) do
    comment = Api.Comments.get_comment(comment.id)
    %{id: comment.id,
      text: comment.text,
      user: comment.user.name,
      user_id: comment.user_id}
  end
end
