  # BASED ON NAT TUCK'S GITHUB
defmodule Api.Places.Place do
  use Ecto.Schema
  import Ecto.Changeset

  schema "places" do
    field :name, :string
    field :website, :string, default: ""
    field :address, :string
    field :description, :text
    field :latitude, :float
    field :longitude, :float
    field :availability, {:array, :string}
    field :photo, :string, default: ""

    belongs_to :user, Api.Users.User
    has_many :comments, Api.Comments.Comment

    timestamps()
  end

  @doc false
  def changeset(place, attrs) do
    place
    |> cast(attrs, [:name, :description, :latitude, :longitude,
      :user_id, :address, :availability, :photo, :website])
    |> validate_required([:name, :description, :latitude, :longitude,
      :user_id, :address, :availability])
  end
end
