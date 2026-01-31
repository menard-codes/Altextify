export const extractShopifyId = (gid: string) => {
  const match = gid.match(/\/(\d+)(?:\/|$)/);

  return match ? match[1] : "";
};
