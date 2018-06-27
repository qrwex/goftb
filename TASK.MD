Game of Thrones Battle API

Use the CSV file (https://www.dropbox.com/s/r8oju5a2t4rr12z/battles.csv?dl=0) to load the data in mongodb.

Use battle data to build an API Server using Node.JS/Express which exposes following 4 endpoints:
/list
returns list(array) of all the places where battle has taken place.
/count
returns total number of battle occurred.
/stats
Returns:
{
	"most_active":{
		"attacker_king": "xxx",
		"defender_king": "xxx",
		"region": "xxx"
	},
	"attacker_outcome":{
		"win": 1000, // total win
		"loss": 1000 // total loss
	},
	"battle_type":[], // unique battle types
	"defender_size":{
		"average": 10,
		"min": 5,
		"max": 100
	}
}
/search
“/search?king=Robb Stark” - return list of battles were 'attacker_king' or 'defender_king' was 'Robb Stark'

Should also work for multiple queries
“/search?king=Robb Stark&location=Riverrun&type=siege”


A PLUS FOR USING TYPESCRIPT