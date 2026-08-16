import { createContext } from "react";

export const Appcontext = createContext();

const Appcontextprovider = (props) => {

    const currency='$'

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const months = [ "", "Jan", "feb", "mar",  "apr", "may",   "jun",   "jul","aug","sep", "oct",    "nov",
"dec",];

  const slotDateformat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const value = {
    calculateAge,
    slotDateformat,
  };

  return (
    <Appcontext.Provider value={value}>{props.children}</Appcontext.Provider>
  );
};

export default Appcontextprovider;
