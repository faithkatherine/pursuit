import * as Linking from "expo-linking";

export const buildVoteLink = (shareToken?: string | null) => {
  if (!shareToken) {
    return "";
  }

  return Linking.createURL(`/group-plans/share/${shareToken}`);
};
