export function getFlagUrl(countryCode: string, width?: number) {
	if (!width) {
		return `https://osuflags.omkserver.nl/${countryCode}.png`;
	}

	return `https://osuflags.omkserver.nl/${countryCode}-${width}.png`;
}
