import { useEffect } from "react";
import { useFormikContext } from "formik";

export default function Autosave() {
  const { values } = useFormikContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.setItem("form", JSON.stringify(values));
    }, 2000);

    return () => clearTimeout(timeout);
  }, [values]);

  return null;
}
