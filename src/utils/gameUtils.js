import mineIcon from '../assets/icon/mine_icon.png';

export const getGameThumbnail = (game) => {
  if (game?.id === 'minesweeper') return mineIcon;
  return game?.thumbnail;
};
