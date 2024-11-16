export const getPair = (token: string) => {
  switch (token) {
    case "0x968B3aF609C392ff02a97CCb868AE334F10D4C77":
      return "0x89B10fe88a4bb6D4727cfE18ad6356A89BD2FE23";
  }

  throw new Error("pair not found.");
};
