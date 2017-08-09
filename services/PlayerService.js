'use strict';

var Player = require('../models/Player');

module.exports = {
	findOne,
	findOneOrCreate,
	getPlayerId
}

function findOne(playerId) {

	return Player.findOne({ _id: playerId });

}

function findOneOrCreate(player) {

	if (player.pfrId) {

		return Player.findOne({ pfrId: player.pfrId })
		.then((result) => {

			if (!result) {

				return Player.create({
					pfrId: player.pfrId,
					name: player.name,
					position: player.position
				});

			}

			return result;

		})
		.catch((err) => {
			console.log(`ERROR IN PLAYERSERVICE FINDORCREATE WITH PFRID ${player}`);
			throw err;
		});

	}

	return Player.find({ name: player.name, position: player.position })
	.then((results) => {

		if (results.length === 0) {

			if (!player.name) {
				console.log(player);
			}

			return getPlayerId(player.name, 0)
			.then((id) => {

				return Player.create({
					pfrId: id,
					name: player.name,
					position: player.position
				});

			});

		}

		return results[0];

	})
	.catch((err) => {
		console.log(`ERROR IN PLAYERSERVICE FINDORCREATE WITHOUT PFRID ${JSON.stringify(player)}`);
		console.log(err);
		throw err;
	});

}

function getPlayerId(name, number) {

	// if (!name) {
	// 	return;
	// }
	var firstName = name.split(' ')[0];
	var lastName = name.split(' ')[1];
	var newId = lastName.slice(0,4) + firstName.slice(0,2) + '0' + number;

	return Player.find({ pfrId: newId })
	.then((results) => {

		if (results.length > 0) {
			var newNumber = number + 1;
			return getPlayerId(name, newNumber);
		}

		return newId;

	});

}