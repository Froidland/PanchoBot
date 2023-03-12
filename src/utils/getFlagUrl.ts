export function getFlagUrl(code: string, width?: number) {
  if (!width) {
    return `https://osuflags.omkserver.nl/${code}.png`;
  }

  return `https://osuflags.omkserver.nl/${code}-${width}.png`;
}
