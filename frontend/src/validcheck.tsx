export const validcheck = (formdata: any, confirmpassword: string) => {
  for (const element in formdata) {
    if (formdata[element] === "" || formdata[element] === undefined) {
      throw new Error(`Empty value provided for ${element}`);
    }
  }
  if (formdata.newpassword !== confirmpassword) {
    throw new Error("Password and confirmation password do not match");
  }
};
