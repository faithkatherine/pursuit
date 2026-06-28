import * as Linking from "expo-linking";
import { buildVoteLink as buildSharedVoteLink } from "@shared/utils/links";

export const buildVoteLink = (shareToken?: string | null) => {
  const path = buildSharedVoteLink(shareToken);

  return path ? Linking.createURL(path) : "";
};

export { buildWebVoteLink, parseVoteLink } from "@shared/utils/links";
