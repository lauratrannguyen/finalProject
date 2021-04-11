defmodule Api.Repo.Migrations.CreateComments do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add :text, :string, null: false
      add :user_id, references(:users, on_delete: :nothing), null: false
      add :place_id, references(:places, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:comments, [:user_id])
    create index(:comments, [:place_id])
  end
end
