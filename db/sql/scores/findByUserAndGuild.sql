/*
 * Finds a scores record using both the discord user id and discord guild id
 */
SELECT
	users.user_id,
	users.id,
	guilds.guild_id,
	guilds.id,
	scores.power_destroyed,
	scores.resources_raided,
	scores.total_power,
	scores.pvp_ships_destroyed,
	scores.pvp_kd_ratio,
	scores.pvp_total_damage,
	scores.hostiles_destroyed,
	scores.hostiles_total_damage,
	scores.resources_mined,
	scores.level
FROM
	scores
JOIN users ON users.id = scores.user_id
JOIN guilds ON guilds.id = scores.guild_id
WHERE guilds.guild_id = ${guildId} AND users.user_id = ${userId}
;
