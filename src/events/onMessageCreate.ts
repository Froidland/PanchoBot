import { Message } from "discord.js";

type Translation = {
	translations: {
		detected_source_language: string;
		text: string;
	}[];
};

export const onMessageCreate = async (message: Message) => {
	if (!message.author.bot) {
		switch (message.channel.id) {
			case "872487113071943711":
				switch (message.content) {
					case "ol":
						await message.reply({
							content: "ol",
							allowedMentions: { repliedUser: false },
						});
						break;
					case "adiol":
						await message.reply({
							content: "<:olluo:967332372301369366>",
							allowedMentions: { repliedUser: false },
						});
						break;
					default:
						await message.delete();
						break;
				}
				break;
			case "968359767493967883":
				await message.delete();
				break;
			case "1104239309806125158":
				if (!translationWhitelist.includes(message.author.id)) {
					return;
				}

				const translation = await getTranslation(message.content);

				if (translation) {
					await message.reply({
						content: translation,
						allowedMentions: { repliedUser: false },
					});
				}

				break;
		}
	}
};

async function getTranslation(message: string) {
	const apiUrl = "https://api-free.deepl.com/v2/translate";

	const translationResponse = await fetch(
		`${apiUrl}?text=${encodeURIComponent(message)}&target_lang=EN`,
		{
			method: "POST",
			headers: {
				Authorization: "DeepL-Auth-Key " + process.env.DEEPL_API_KEY,
			},
		}
	);

	if (!translationResponse.ok) {
		return null;
	}

	const translation = (await translationResponse.json()) as Translation;

	if (translation.translations[0].detected_source_language === "EN") {
		return null;
	}

	return translation.translations[0].text;
}

const translationWhitelist = [
	"329379151364751360",
	"292478478295498762",
	"278368808627077120",
];
