import { REST, Routes } from "discord.js";

/* type RestUser = {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	public_flags: number;
	premium_type: number;
	flags: number;
	bot: boolean;
	banner: unknown;
	accent_color: unknown;
	global_name: string | null;
	avatar_decoration_data: unknown;
	banner_color: unknown;
	mfa_enabled: boolean;
	locale: string;
	email: string | null;
	verified: boolean;
	bio: string;
}; */

async function run() {
	const rest = new REST().setToken(process.env.BOT_TOKEN!);
	let clientUser;

	try {
		clientUser = await rest.get(Routes.user());
	} catch (err) {
		console.error("Unable to fetch client user. Aborting...", err);
		return;
	}

	if (!clientUser) {
		console.error("Client user is null. Aborting...");
		return;
	}

	console.log(typeof clientUser);

	// clientUser = clientUser as RestUser;

	// try {
	// 	await rest.put(Routes.applicationCommands(clientUser.id), { body: [] });
	// } catch (error) {
	// 	console.error("Unable to delete global commands. Aborting...");
	// 	return;
	// }

	// console.log("Successfully deleted all guild commands.");
}

await run();
