class AddUserSpotifyToSpotifyDatum < ActiveRecord::Migration[8.0]
  def change
    add_reference :spotify_data, :spotify_user, null: false, foreign_key: true
  end
end
