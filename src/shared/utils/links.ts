export const buildVoteLink = (shareToken?: string | null) => {
  if (!shareToken) {
    return "";
  }

  return `/group-plans/share/${shareToken}`;
};

export const buildWebVoteLink = (
  baseUrl: string,
  shareToken?: string | null,
) => {
  if (!shareToken) {
    return "";
  }

  return `${baseUrl.replace(/\/$/, "")}${buildVoteLink(shareToken)}`;
};

export const parseVoteLink = (url: string) => {
  const match = url.match(/\/group-plans\/share\/([^/?#]+)/);
  return match?.[1] ?? null;
};
