class CreateSpotifyData < ActiveRecord::Migration[8.0]
  def change
    create_table :spotify_data do |t|
      t.string :platform
      t.integer :ms_played
      t.string :conn_country
      t.string :ip_addr
      t.string :master_metadata_track_name
      t.string :master_metadata_album_artist_name
      t.string :master_metadata_album_album_name
      t.string :spotify_track_uri
      t.string :episode_name
      t.string :episode_show_name
      t.string :spotify_episode_uri
      t.string :audiobook_title
      t.string :audiobook_uri
      t.string :audiobook_chapter_uri
      t.string :audiobook_chapter_title
      t.string :reason_start
      t.string :reason_end
      t.boolean :shuffle
      t.boolean :skipped
      t.boolean :offline
      t.string :offline_timestamp
      t.boolean :incognito_mode

      t.timestamps
    end
  end
end
