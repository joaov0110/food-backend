export const filterTenatWithDiferentId = (tenant_id: number) => {
  return {
    NOT: {
      id: {
        equals: tenant_id,
      },
    },
  };
};
