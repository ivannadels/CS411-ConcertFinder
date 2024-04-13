const mockArtistsDatabase = {
  "href": "https://api.spotify.com/v1/artists?offset=0&limit=20",
  "limit": 20,
  "next": "https://api.spotify.com/v1/artists?offset=20&limit=20",
  "offset": 0,
  "previous": null,
  "total": 4,
  "items": [
    {
      "external_urls": { "spotify": "https://open.spotify.com/artist/1" },
      "followers": { "href": null, "total": 250000 },
      "genres": ["Alternative rock", "Emo"],
      "href": "https://api.spotify.com/v1/artists/1",
      "id": "1",
      "images": [
        {
          "url": "https://images.unsplash.com/photo-1578301978018-3005759f48f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1144&q=80",
          "height": 640,
          "width": 640
        }
      ],
      "name": "Katy Perry",
      "popularity": 80,
      "type": "artist",
      "uri": "spotify:artist:1"
    },
    {
      "external_urls": { "spotify": "https://open.spotify.com/artist/2" },
      "followers": { "href": null, "total": 150000 },
      "genres": ["Pop", "Dance pop"],
      "href": "https://api.spotify.com/v1/artists/2",
      "id": "2",
      "images": [
        {
          "url": "/artistimgs/sza.jpg",
          "height": 640,
          "width": 640
        }
      ],
      "name": "Artist Name 2",
      "popularity": 90,
      "type": "artist",
      "uri": "spotify:artist:2"
    },
    {
        "external_urls": { "spotify": "https://open.spotify.com/artist/2" },
        "followers": { "href": null, "total": 150000 },
        "genres": ["Pop", "Dance pop"],
        "href": "https://api.spotify.com/v1/artists/2",
        "id": "2",
        "images": [
          {
            "url": "/artistimgs/billie.jpg",
            "height": 640,
            "width": 640
          }
        ],
        "name": "Artist Name 2",
        "popularity": 90,
        "type": "artist",
        "uri": "spotify:artist:2"
      }
    // Add more artists as needed
  ]
};

export default mockArtistsDatabase;
