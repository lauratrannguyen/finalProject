  # BASED ON NAT TUCK'S GITHUB
defmodule Api.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "comments" do
    field :text, :string

    belongs_to :user, Api.Users.User
    belongs_to :place, Api.Places.Place

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:text, :user_id, :place_id])
    |> validate_required([:text, :user_id, :place_id])
  end
end
