import {
  arrayOf,
  OutfitTattooStatus,
  TattooDef,
  getMaxTattooLevel,
  isMiscTattoo,
  isOutfitTattoo,
} from "greenbox-data";

import Thing from "./Thing";

type Props = {
  tattoo: TattooDef;
  level: number;
};

function determineState(tattoo: TattooDef, level: number, max: number) {
  if (isOutfitTattoo(tattoo) && level == OutfitTattooStatus.HAVE_OUTFIT) return "partial";
  if (level >= max) return "complete";
  if (level > 0) return "partial";
  return null;
}

function determineTitle(tattoo: TattooDef, level: number, max: number) {
  const step = max > 1 ? ` (level ${level} / ${max})` : "";
  if (isOutfitTattoo(tattoo) && level == OutfitTattooStatus.HAVE_OUTFIT)
    return "Have necessary outfit";
  if (level >= max) return "Have" + step;
  if (level > 0) return "Partially have" + step;
  return "Do not have" + step;
}

export default function Tattoo({ tattoo, level }: Props) {
  const max = getMaxTattooLevel(tattoo);
  const anchor = guessAnchorFromTattooImage(tattoo);

  // Show the current level of the tattoo, or the full version if no levels have been attained yet.
  const image = arrayOf(tattoo.image)[Math.min(max, level > 0 ? level : max) - 1];

  return (
    <Thing
      type="tattoo"
      name={tattoo.name}
      image={`otherimages/sigils/${image}.gif`}
      sourceWidth={50}
      state={determineState(tattoo, level, max)}
      title={determineTitle(tattoo, level, max)}
      link={`Tattoo${anchor}`}
    />
  );
}

function guessAnchorFromTattooImage(tattoo: TattooDef) {
  if (isOutfitTattoo(tattoo)) return "";
  if (isMiscTattoo(tattoo)) return "#Miscellaneous_Tattoos";
  const image = arrayOf(tattoo.image)[0];
  if (image.startsWith("class"))
    return image.endsWith("hc") ? "#Ascension_Tattoos" : "#Class_Tattoos";
  if (!isNaN(parseFloat(image[image.length - 1]))) return "#Ascension_Tattoos";
  return "";
}
