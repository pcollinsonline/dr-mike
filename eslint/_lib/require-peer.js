export const requirePeer = async (specifier, featureFlag) => {
  try {
    return await import(specifier)
  } catch {
    throw new Error(
      `dr-mike: { ${featureFlag}: true } requires \`${specifier}\` to be installed. ` +
        `Run: pnpm add -D ${specifier}`,
    )
  }
}
