/**
 * Validates employee form data.
 * @param {Object} formData - The employee form data.
 * @returns {Object} { valid: boolean, error: string|null }
 */
//kilde gpt med regexes og test
//lager denne istedenfor å håndtere dette i editemployee/registrerEmployee
export function validateEmployeeForm(formData) {
  // Helper regexes
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+0-9]{8,15}$/;

  // Epost validering
  if (formData.epost && !emailRegex.test(formData.epost)) {
    return { valid: false, error: "Ugyldig epostadresse (Talkmore)." };
  }
  if (formData.epost_Telenor && !emailRegex.test(formData.epost_Telenor)) {
    return { valid: false, error: "Ugyldig epostadresse (Telenor)." };
  }

  // Telefon validering
  if (formData.phoneNr && !phoneRegex.test(formData.phoneNr)) {
    return { valid: false, error: "Ugyldig telefonnummer." };
  }
  if (
    Array.isArray(formData.relative) &&
    formData.relative[0]?.relative_phoneNr &&
    !phoneRegex.test(formData.relative[0].relative_phoneNr)
  ) {
    return { valid: false, error: "Ugyldig pårørende telefonnummer." };
  }

  //Hvis startdato ikke er satt 
  if (!formData.start_date || formData.start_date === "") {
    return { valid: false, error: "Startdato er påkrevd." };
  }

  // Date validering
  const isValidDate = (date) => date && !isNaN(Date.parse(date));
  if (formData.birthdate && !isValidDate(formData.birthdate)) {
    return { valid: false, error: "Ugyldig fødselsdato." };
  }
  if (formData.start_date && !isValidDate(formData.start_date)) {
    return { valid: false, error: "Ugyldig startdato." };
  }
  if (formData.end_date && formData.end_date !== "" && !isValidDate(formData.end_date)) {
    return { valid: false, error: "Ugyldig sluttdato." };
  }

  // Leave (permisjon) validering / man kan ikke ha tomme felter hvis man har fylt inn et av feltene
  if (formData.leave){

    const { leave_start_date, leave_end_date, leave_percentage } = formData.leave;

    const hasStart = leave_start_date && leave_start_date.trim() !== "";
    const hasEnd = leave_end_date && leave_end_date.trim() !== "";
    const hasPercent = leave_percentage !== undefined && leave_percentage !== null && leave_percentage !== "";

    //hvis start dato er satt og ikke slutt dato -permisjon
    if(hasStart && !hasEnd){
      return {
        valid: false,
        error: 'Du må fylle inn sluttdato for permisjon hvis du har satt startdato'
      };
    }
    //Hvis slutt dato er satt og ikke start dato er satt -permisjon
    if(!hasStart && hasEnd){
      return{
        valid: false,
        error: 'Du må fylle inne startdato hvis du har satt sluttdato'
      }
    }
    //hvis begge datoer er satt og ikke % 
    if(hasStart && hasEnd && !hasPercent){
      return{
        valid: false,
        error: 'Du må fylle inn permisjon % hvis du har satt datoer'
      }
    }
    if (!hasStart && !hasEnd && hasPercent) {
      return {
        valid: false,
        error: 'Du kan ikke fylle inn permisjonsprosent uten å sette start- og sluttdato.'
      };
    }
  }
  return { valid: true, error: null };
}