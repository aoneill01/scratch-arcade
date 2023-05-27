export async function loadGames() {
  const response = await fetch('games/manifest.json');
  return await response.json();
}
