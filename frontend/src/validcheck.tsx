export const validcheck = (formdata: any) => {
  for (const element in formdata) {
    if (formdata[element] === "" || formdata[element] === undefined) {
      throw new Error(`Empty value provided for ${element}`);
    }
  }
};
